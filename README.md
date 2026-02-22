# 💬 Real-Time Chat Application

A full-stack real-time chat application built using the MERN stack and Socket.io.  
Users can authenticate, send messages instantly, and maintain seamless conversations with proper message alignment and ordering.

🌐 **Live Demo:**  
👉 https://chatting-s0qw.onrender.com/

---

## 🚀 Features

- 🔐 User Authentication (Signup / Login / Logout)
- 💬 Real-Time Messaging with Socket.io
- 📦 Persistent Chat History using MongoDB
- 🟢 Online User Status Tracking
- 📱 Responsive & Clean UI
- 🔄 Auto Reload After Login (State Sync Fix)
- 📌 Correct Sender/Receiver Message Alignment
- 📜 Latest Messages Always at Bottom

---

## 🛠 Tech Stack

### Frontend
- React
- Zustand (State Management)
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication

## 🔐 Authentication Flow

1. User signs up or logs in  
2. Server generates JWT token  
3. Token is validated for protected routes  
4. Socket connection is initialized  
5. On logout → token cleared and state reset  
6. Reload ensures consistent chat state  

---

## 🧠 Key Challenges Solved

- Prevented sender/receiver message flipping after re-login  
- Maintained consistent message ordering  
- Fixed state inconsistencies after logout/login  
- Ensured proper socket reconnection handling  

---

## 🔮 Future Improvements

- ✨ Typing indicators  
- 📎 Image & file sharing  
- 👥 Group chat support  
- 🔔 Push notifications  
- 🌙 Dark mode  
