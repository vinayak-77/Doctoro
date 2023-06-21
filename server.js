const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

dotenv.config();

// Mongodb connection
connectDB();

const app = express();
const http = require("http").createServer(app); // Create HTTP server

// Socket.IO integration
const io = new Server(http);

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
  console.log("A user connected");

  let roomID;
  // Join room
  socket.on("joinRoom", ({ username, roomID }) => {
    roomID = roomID;
    socket.join(roomID);
    socket.username = username;

    // Emit message to the room
    io.to(roomID).emit("message", {
      // user: "System",
      // text: `${username} joined the room.`,
      // timestamp: new Date().toLocaleTimeString(),
      // console.log(`${username} joined the room.`);
    });

    // Emit updated user list to the room
    const room = io.sockets.adapter.rooms.get(roomID);
    const userList = room
      ? Array.from(room).map(
          (socketId) => io.sockets.sockets.get(socketId).username
        )
      : [];
    io.to(roomID).emit("userList", userList);
  });

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    io.to(message.roomID).emit("message", {
      user: message.user,
      text: message.text,
      timestamp: new Date().toLocaleTimeString(),
    });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");

    if (socket.username) {
      // Emit message to the room
      io.to(roomID).emit("message", {
        user: "System",
        text: `${socket.username} left the room.`,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Emit updated user list to the room
      const room = io.sockets.adapter.rooms.get(roomID);
      const userList = room
        ? Array.from(room).map(
            (socketId) => io.sockets.sockets.get(socketId).username
          )
        : [];
      io.to(roomID).emit("userList", userList);
    }
  });
});

// Listen on port
const port = process.env.PORT || 8080;

http.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan
      .white
  );
});
