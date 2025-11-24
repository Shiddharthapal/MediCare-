import Call from "../models/Call.js";

// Store active users: userId -> socketId
const activeUsers = new Map();

// Store ongoing calls: callId -> { caller, receiver, startTime }
const activeCalls = new Map();

export function videoCallHandler(io) {
  io.on("connection", (socket) => {
    // User registers themselves when they come online
    socket.on("register-user", async (userId) => {
      try {
        activeUsers.set(userId, socket.id);
        socket.userId = userId;

        console.log(`User ${userId} registered with socket ${socket.id}`);

        // Notify user's contacts that they are online
        socket.broadcast.emit("user-online", { userId });

        // Send list of online users back to this user
        const onlineUsers = Array.from(activeUsers.keys());
        socket.emit("online-users", onlineUsers);
      } catch (error) {
        console.error("Error registering user:", error);
        socket.emit("error", { message: "Registration failed" });
      }
    });

    // Initiate a call
    socket.on("call-user", async ({ userToCall, signalData, from, name }) => {
      try {
        const recipientSocketId = activeUsers.get(userToCall);

        if (!recipientSocketId) {
          socket.emit("call-failed", {
            message: "User is not available",
          });
          return;
        }

        // Create call record in database
        const callRecord = new Call({
          caller: from,
          receiver: userToCall,
          startedAt: new Date(),
          status: "initiated",
        });
        await callRecord.save();

        // Store active call info
        activeCalls.set(callRecord._id.toString(), {
          caller: from,
          receiver: userToCall,
          startTime: Date.now(),
          callId: callRecord._id.toString(),
        });

        // Send call notification to recipient
        io.to(recipientSocketId).emit("incoming-call", {
          signal: signalData,
          from,
          name,
          callId: callRecord._id.toString(),
        });

        console.log(`Call initiated from ${from} to ${userToCall}`);
      } catch (error) {
        console.error("Error initiating call:", error);
        socket.emit("error", { message: "Failed to initiate call" });
      }
    });

    // Answer a call
    socket.on("answer-call", async ({ signal, to, callId }) => {
      try {
        const recipientSocketId = activeUsers.get(to);

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("call-accepted", signal);

          // Update call status in database
          if (callId) {
            await Call.findByIdAndUpdate(callId, {
              status: "active",
              startedAt: new Date(),
            });
          }

          console.log(`Call answered: ${callId}`);
        }
      } catch (error) {
        console.error("Error answering call:", error);
      }
    });

    // Decline a call
    socket.on("decline-call", async ({ to, callId }) => {
      try {
        const recipientSocketId = activeUsers.get(to);

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("call-declined");
        }

        // Update call status
        if (callId) {
          await Call.findByIdAndUpdate(callId, {
            status: "declined",
            endedAt: new Date(),
          });
          activeCalls.delete(callId);
        }

        console.log(`Call declined: ${callId}`);
      } catch (error) {
        console.error("Error declining call:", error);
      }
    });

    // End a call
    socket.on("end-call", async ({ to, callId }) => {
      try {
        const recipientSocketId = activeUsers.get(to);

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("call-ended");
        }

        // Update call record with duration
        if (callId && activeCalls.has(callId)) {
          const callInfo = activeCalls.get(callId);
          const duration = Math.floor((Date.now() - callInfo.startTime) / 1000);

          await Call.findByIdAndUpdate(callId, {
            status: "completed",
            endedAt: new Date(),
            duration,
          });

          activeCalls.delete(callId);
          console.log(`Call ended: ${callId}, Duration: ${duration}s`);
        }
      } catch (error) {
        console.error("Error ending call:", error);
      }
    });

    // Handle ICE candidates for better connection
    socket.on("ice-candidate", ({ candidate, to }) => {
      const recipientSocketId = activeUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("ice-candidate", candidate);
      }
    });

    // Handle call quality issues
    socket.on("connection-quality", ({ to, quality }) => {
      const recipientSocketId = activeUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("peer-connection-quality", quality);
      }
    });

    // Disconnect handler
    socket.on("disconnect", async () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);

        // Notify others that user went offline
        socket.broadcast.emit("user-offline", { userId: socket.userId });

        // End any active calls
        for (const [callId, callInfo] of activeCalls.entries()) {
          if (
            callInfo.caller === socket.userId ||
            callInfo.receiver === socket.userId
          ) {
            const otherUser =
              callInfo.caller === socket.userId
                ? callInfo.receiver
                : callInfo.caller;

            const otherSocketId = activeUsers.get(otherUser);
            if (otherSocketId) {
              io.to(otherSocketId).emit("call-ended");
            }

            // Update call status
            const duration = Math.floor(
              (Date.now() - callInfo.startTime) / 1000
            );
            await Call.findByIdAndUpdate(callId, {
              status: "completed",
              endedAt: new Date(),
              duration,
            });

            activeCalls.delete(callId);
          }
        }

        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
}
