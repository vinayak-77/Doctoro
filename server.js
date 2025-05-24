const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const ChatRoom = require("./models/chatModel");
const moment = require('moment');

dotenv.config();

// Mongodb connection
connectDB();

const app = express();
const http = require("http").createServer(app);

// Socket.IO integration with CORS configuration
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
app.use("/api/v1/chat", require("./routes/chatRoutes"));

// Socket.IO events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join room
  socket.on("joinRoom", ({ username, roomID }) => {
    console.log(`${username} joining room ${roomID}`);
    socket.join(roomID);
    socket.username = username;
    socket.currentRoom = roomID;

    // Emit message to the room
    const joinMessage = {
      user: "System",
      text: `${username} joined the chat`,
      timestamp: new Date().toISOString()
    };
    io.to(roomID).emit("message", joinMessage);

    // Get all sockets in the room
    const room = io.sockets.adapter.rooms.get(roomID);
    const userList = room
      ? Array.from(room).map(socketId => {
          const socket = io.sockets.sockets.get(socketId);
          return socket.username;
        }).filter(Boolean)
      : [];
    
    console.log(`Users in room ${roomID}:`, userList);
    io.to(roomID).emit("userList", userList);
  });

  // Handle incoming messages
  socket.on("sendMessage", async (messageData) => {
    console.log(`Message received in room ${messageData.roomID}:`, messageData);
    
    try {
      // Save message to database
      const chatRoom = await ChatRoom.findOne({ roomID: messageData.roomID });
      
      if (!chatRoom) {
        // Create new chat room if it doesn't exist
        const newChatRoom = new ChatRoom({
          roomID: messageData.roomID,
          messages: [{
            user: messageData.user,
            text: messageData.text,
            timestamp: new Date(messageData.timestamp)
          }]
        });
        await newChatRoom.save();
      } else {
        // Add message to existing chat room
        chatRoom.messages.push({
          user: messageData.user,
          text: messageData.text,
          timestamp: new Date(messageData.timestamp)
        });
        await chatRoom.save();
      }

      // Broadcast the message to ALL users in the room (including sender)
      io.in(messageData.roomID).emit("receiveMessage", messageData);
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.username);
    
    if (socket.username && socket.currentRoom) {
      // Emit message to the room
      const leaveMessage = {
        user: "System",
        text: `${socket.username} left the chat`,
        timestamp: new Date().toISOString()
      };
      io.to(socket.currentRoom).emit("message", leaveMessage);

      // Get updated user list
      const room = io.sockets.adapter.rooms.get(socket.currentRoom);
      const userList = room
        ? Array.from(room).map(socketId => {
            const socket = io.sockets.sockets.get(socketId);
            return socket.username;
          }).filter(Boolean)
        : [];
      
      console.log(`Users remaining in room ${socket.currentRoom}:`, userList);
      io.to(socket.currentRoom).emit("userList", userList);
    }
  });
});

// Listen on port
const port = process.env.PORT || 8080;

http.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan.white
  );
});
