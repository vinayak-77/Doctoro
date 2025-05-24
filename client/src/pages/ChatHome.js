import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Chat from "../components/Chat";
import "../styles/chatHome.css";
import "../styles/Chat.css";
import Layout from "../components/Layout";

// Initialize socket connection with proper configuration
const socket = io("http://localhost:8080", {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*"
  }
});

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [roomID, setRoomID] = useState("");
  const [join, setJoin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value.trim());
  };

  const handleRoomIDChange = (e) => {
    setRoomID(e.target.value.trim());
  };

  const handleJoinRoom = () => {
    if (username && roomID && connected) {
      setIsLoading(true);
      socket.emit("joinRoom", { username, roomID });
      setJoin(true);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && username && roomID && connected) {
      handleJoinRoom();
    }
  };

  const handleArrowClick = () => {
    setJoin(false);
    socket.disconnect();
    navigate("/");
  };

  useEffect(() => {
    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnected(false);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    // Ensure socket connects
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return !join ? (
    <Layout>
      <div className="homepage-container">
        <h1 className="logo">DOCTORO CHAT</h1>
        <div className="form-container">
          {!connected && (
            <div className="connection-error">
              Connecting to server...
            </div>
          )}
          <label className="label">
            <span>Username</span>
            <input
              className="input"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your name"
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </label>
          <label className="label">
            <span>Room ID</span>
            <input
              className="input"
              type="text"
              value={roomID}
              onChange={handleRoomIDChange}
              placeholder="Enter room ID"
              onKeyPress={handleKeyPress}
            />
          </label>
          <button 
            className="button" 
            onClick={handleJoinRoom}
            disabled={!username || !roomID || isLoading || !connected}
          >
            {isLoading ? "Joining..." : connected ? "Join Chat Room" : "Connecting..."}
          </button>
        </div>
      </div>
    </Layout>
  ) : (
    <>
      <div className="arrows" onClick={handleArrowClick}>
        <i className="fa-solid fa-arrow-left-long"></i>
      </div>
      <Chat socket={socket} username={username} roomID={roomID} />
    </>
  );
};

export default HomePage;
