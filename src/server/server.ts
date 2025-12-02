import { Server } from "socket.io";
import http from "http";
import express from "express";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:4321",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Store room participants
const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Join a video call room
  socket.on("join-room", ({ roomId, userId, userName }) => {
    console.log(`[Socket] User ${userId} joining room ${roomId}`);

    socket.join(roomId);

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    const room = rooms.get(roomId);
    room.add(socket.id);

    // Store user info on socket
    socket.userId = userId;
    socket.userName = userName;
    socket.roomId = roomId;

    // Get other users in the room
    const otherUsers = Array.from(room).filter((id) => id !== socket.id);

    // Notify the joining user about other participants
    socket.emit("existing-users", {
      users: otherUsers.map((id) => {
        const userSocket = io.sockets.sockets.get(id);
        return {
          socketId: id,
          userId: userSocket?.userId,
          userName: userSocket?.userName,
        };
      }),
    });

    // Notify other users about the new participant
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      userId,
      userName,
    });
  });

  // Handle WebRTC signaling - Offer
  socket.on("offer", ({ target, sdp, callerId }) => {
    console.log(`[Socket] Offer from ${socket.id} to ${target}`);
    io.to(target).emit("offer", {
      sdp,
      callerId: socket.id,
      callerUserId: socket.userId,
      callerName: socket.userName,
    });
  });

  // Handle WebRTC signaling - Answer
  socket.on("answer", ({ target, sdp }) => {
    console.log(`[Socket] Answer from ${socket.id} to ${target}`);
    io.to(target).emit("answer", {
      sdp,
      calleeId: socket.id,
    });
  });

  // Handle ICE candidates
  socket.on("ice-candidate", ({ target, candidate }) => {
    console.log(`[Socket] ICE candidate from ${socket.id} to ${target}`);
    io.to(target).emit("ice-candidate", {
      candidate,
      from: socket.id,
    });
  });

  // Toggle video
  socket.on("toggle-video", ({ roomId, isVideoEnabled }) => {
    socket.to(roomId).emit("user-toggled-video", {
      socketId: socket.id,
      isVideoEnabled,
    });
  });

  // Toggle audio
  socket.on("toggle-audio", ({ roomId, isAudioEnabled }) => {
    socket.to(roomId).emit("user-toggled-audio", {
      socketId: socket.id,
      isAudioEnabled,
    });
  });

  // Leave room
  socket.on("leave-room", ({ roomId }) => {
    handleUserLeaving(socket, roomId);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
    if (socket.roomId) {
      handleUserLeaving(socket, socket.roomId);
    }
  });
});

function handleUserLeaving(socket, roomId) {
  console.log(`[Socket] User ${socket.id} leaving room ${roomId}`);

  socket.leave(roomId);

  // Remove user from room
  const room = rooms.get(roomId);
  if (room) {
    room.delete(socket.id);

    // Delete room if empty
    if (room.size === 0) {
      rooms.delete(roomId);
    }
  }

  // Notify other users
  socket.to(roomId).emit("user-left", {
    socketId: socket.id,
    userId: socket.userId,
  });
}

// Start server
const PORT = process.env.SOCKET_PORT || 5001;
server.listen(PORT, () => {
  console.log(`[Socket Server] Running on port ${PORT}`);
});

export { io, server };
