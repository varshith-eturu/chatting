import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// ✅ Use Map instead of object (safer & cleaner)
const userSocketMap = new Map(); // userId -> socketId

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    // ✅ Replace existing socket if user reconnects
    userSocketMap.set(userId, socket.id);
  }

  // Send updated online users list to everyone
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // ✅ IMPORTANT: Only remove if this socket is still the active one
    if (userSocketMap.get(userId) === socket.id) {
      userSocketMap.delete(userId);
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };
