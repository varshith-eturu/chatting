import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";
import {app, server } from "./lib/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// FIXED ORDER
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow cookies to be sent
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req,res) =>{
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    
  })
}

server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
  connectDB();
});
