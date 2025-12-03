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

// Store room participants and chat history (in-memory)
const rooms = new Map();
const chatHistory = new Map();

io.on("connection", (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Join a video call room (roomId + emailId from client)
  socket.on("join-room", ({ roomId, emailId }) => {
    if (!roomId || !emailId) {
      socket.emit("join-room-error", {
        message: "roomId and emailId are required",
      });
      return;
    }

    console.log(`[Socket] User ${emailId} joining room ${roomId}`);

    socket.join(roomId);

    // confirm to the joining client
    socket.emit("joined-room", { roomId });

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    const room = rooms.get(roomId);
    room.add(socket.id);

    // Store user info on socket
    socket.emailId = emailId;
    socket.roomId = roomId;

    // Get other users in the room
    const otherUsers = Array.from(room).filter((id) => id !== socket.id);

    // Notify the joining user about other participants
    socket.emit("existing-users", {
      users: otherUsers.map((id) => {
        const userSocket = io.sockets.sockets.get(id);
        return {
          socketId: id,
          emailId: userSocket?.emailId,
          roomId: userSocket?.roomId,
        };
      }),
    });

    // Notify other users about the new participant
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      emailId,
    });
  });

  // Chat: join a conversation room (doctorEmail + patientEmail => deterministic room)
  socket.on("chat:join", ({ roomId, userEmail, userRole }) => {
    if (!roomId || !userEmail || !userRole) {
      socket.emit("chat:error", {
        message: "roomId, userEmail, and userRole are required",
      });
      return;
    }

    socket.join(roomId);

    if (!chatHistory.has(roomId)) {
      chatHistory.set(roomId, []);
    }

    // Send existing history to the joining client
    socket.emit("chat:history", {
      roomId,
      messages: chatHistory.get(roomId),
    });
  });

  // Chat: broadcast a message to the room and persist in memory
  socket.on("chat:message", ({ roomId, text, senderEmail, senderRole }) => {
    if (!roomId || !text || !senderEmail || !senderRole) {
      socket.emit("chat:error", {
        message: "roomId, text, senderEmail, and senderRole are required",
      });
      return;
    }

    const history = chatHistory.get(roomId) || [];
    const message = {
      id: `${Date.now()}-${socket.id}`,
      roomId,
      text,
      senderEmail,
      senderRole,
      timestamp: Date.now(),
    };

    // Keep a bounded history (e.g., last 200 messages)
    history.push(message);
    if (history.length > 200) {
      history.shift();
    }
    chatHistory.set(roomId, history);

    io.to(roomId).emit("chat:message", message);
  });

  // Handle WebRTC signaling - Offer
  socket.on("offer", ({ target, sdp }) => {
    if (!target || !sdp) return;
    console.log(`[Socket] Offer from ${socket.id} to ${target}`);
    io.to(target).emit("offer", {
      sdp,
      callerId: socket.id,
      roomId: socket.roomId,
      emailId: socket.emailId,
    });
  });

  // Handle WebRTC signaling - Answer
  socket.on("answer", ({ target, sdp }) => {
    if (!target || !sdp) return;
    console.log(`[Socket] Answer from ${socket.id} to ${target}`);
    io.to(target).emit("answer", {
      sdp,
      calleeId: socket.id,
      emailId: socket.emailId,
    });
  });
  // Server-side Socket.IO handlers
  socket.on("end-call-by-creator", ({ target, roomId, emailId }) => {
    // Notify the target user that creator ended the call
    io.to(target).emit("end-call-by-creator", { emailId });
  });

  socket.on("user-leaving", ({ target, roomId, emailId }) => {
    // Notify only the specific target user that someone left
    io.to(target).emit("user-leaving", { emailId });
  });

  // Handle ICE candidates
  socket.on("ice-candidate", ({ target, candidate }) => {
    if (!target || !candidate) return;
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
    emailId: socket.emailId,
  });
}

// Start server
const PORT = process.env.SOCKET_PORT || 5001;
server.listen(PORT, () => {
  console.log(`[Socket Server] Running on port ${PORT}`);
});

export { io, server };
