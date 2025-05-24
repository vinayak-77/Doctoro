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
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/v1/chat/${roomID}/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setMessages(res.data.chatHistory);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    // Create Socket.IO connection
    const newSocket = io('', {
      transports: ['websocket'],
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
      
      // Join the room after connection
      newSocket.emit("joinRoom", { username, roomID });
      
      // Fetch existing messages
      fetchMessages();
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    // Listen for new messages
    newSocket.on("message", (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for user list updates
    newSocket.on("userList", (userList) => {
      console.log('Updated user list:', userList);
      setUsers(userList);
    });

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, [roomID, username]);

  const handleSendMessage = async () => {
    if (messageInput.trim() !== "" && socket && connected) {
      const message = {
        user: username,
        text: messageInput,
        roomID: roomID,
        timestamp: new Date().toLocaleString()
      };

      console.log('Sending message:', message);

      // Send message through socket
      socket.emit("sendMessage", message);

      // Save message to database
      try {
        await axios.post(`/api/v1/chat/${roomID}/message`, message, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }

      setMessageInput("");
    }
  };

  return (
    <div className="chat-page">
      <div className="header">
        <h2>Chat Room</h2>
        <p>Room ID: {roomID}</p>
        <p>Connected as: {username}</p>
        <p className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </p>
      </div>
      <div className="chatting-area">
        <div className="sidebar">
          <h3>Online Users ({users.length})</h3>
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
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          disabled={!connected}
        />
        <button onClick={handleSendMessage} disabled={!connected}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
