import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; // Import the Socket.IO client library

import "../styles/chatHome.css";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [roomID, setRoomID] = useState("");
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null); // Add socket state

  useEffect(() => {
    // Create a Socket.IO connection when the component mounts
    console.log("HELOOOOO");
    const newSocket = io(); // Connect to the socket server
    console.log(newSocket);
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleRoomIDChange = (e) => {
    setRoomID(e.target.value);
  };

  const handleJoinRoom = () => {
    // Redirect to the chat room page with roomID included in the URL
    navigate(`/chat/${roomID}`);
  };

  return (
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
  );
};

export default HomePage;
