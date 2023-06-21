import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "../styles/ChatPage.css";

const ChatPage = () => {
  const location = useLocation();
  const roomID = location.pathname.replace("/chat/", "");
  const username = new URLSearchParams(location.search).get("username");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null); // Declare socket as a state variable
  const [newmessage, setNewmessage] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/v1/chat/${roomID}/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.status === false) {
        console.log("herrrerese");
      } else {
        setMessages(res.data.chatHistory);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    // Create a Socket.IO connection when the component mounts
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit("joinRoom", { username, roomID });

    fetchMessages();

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("userList", (userList) => {
      setUsers(userList);
    });

    // Receive and handle user list updates
    newSocket.on("userList", (userList) => {
      setUsers(userList);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [roomID, username]);

  const handleSendMessage = async () => {
    if (messageInput.trim() !== "") {
      const message = {
        user: username,
        text: messageInput,
        timestamp: new Date().toLocaleString(), // Add timestamp to the message
      };

      try {
        // Send the message to the backend API

        await axios.post(`/api/v1/chat/${roomID}/message`, message, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNewmessage(true);
      } catch (error) {
        console.error("Error sending message:", error);
      }

      // Clear the message input
      setMessageInput("");

      // Update the messages state to display the sent message immediately
      setMessages((prevMessages) => [...prevMessages, message]);
      // fetchMessages();
    }
  };

  return (
    <div className="chat-page">
      <div className="header">
        <h2>Chat</h2>
        <p>Room ID: {roomID}</p>
        <p>Username: {username}</p>
      </div>
      <div className="chatting-area">
        <div className="sidebar">
          <h3>Users</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>

        <div className="chat-area">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.user === username ? "sent" : "received"
              }`}
            >
              <p className="username">{message.user}</p>
              <p className="text">{message.text}</p>
              <p className="timestamp">{message.timestamp}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="input-area">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
