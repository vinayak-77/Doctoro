import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; // Import the Socket.IO client library
import Chat from "../components/Chat";
import "../styles/chatHome.css";
import "../styles/Chat.css";
import Layout from "../components/Layout";

const socket = io();

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [roomID, setRoomID] = useState("");
  const navigate = useNavigate();
  const [join, setJoin] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleRoomIDChange = (e) => {
    setRoomID(e.target.value);
  };

  const handleJoinRoom = () => {
    // Redirect to the chat room page with roomID and username included in the URL
    setJoin(true);
    socket.emit("joinRoom", { username, roomID });
  };

  const handleArrowClick = () => {
    setJoin(false);
    socket.disconnect();
    navigate("/");
  };

  return !join ? (
    <Layout>
      <div className="homepage-container">
        <h3 className="logo">DOCTORO</h3>
        <div className="form-container">
          <label className="label">
            Username:
            <input
              className="input"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
          <label className="label">
            Room ID:
            <input
              className="input"
              type="text"
              value={roomID}
              onChange={handleRoomIDChange}
            />
          </label>
          <button className="button" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      </div>
    </Layout>
  ) : (
    <>
      <div className="arrow" onClick={handleArrowClick}>
        <span>&#8592;</span>
      </div>

      <Chat socket={socket} username={username} roomID={roomID} />
    </>
  );
};

export default HomePage;
