import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "../styles/Chat.css";

const Chat = ({ socket, username, roomID }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);

  const sendMessage = async () => {
    if (message.trim() !== "") {
      const messageData = {
        roomID: roomID,
        user: username,
        text: message,
        timestamp: new Date().toISOString()
      };
      
      await socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  useEffect(() => {
    // Listen for regular messages
    socket.on("receiveMessage", (data) => {
      setMessageList((list) => [...list, {
        ...data,
        displayTime: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    // Listen for system messages (join/leave)
    socket.on("message", (data) => {
      setMessageList((list) => [...list, {
        ...data,
        displayTime: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    // Listen for user list updates
    socket.on("userList", (users) => {
      setUserList(users);
    });
    
    return () => {
      socket.off("receiveMessage");
      socket.off("message");
      socket.off("userList");
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chat Room: {roomID}</p>
        <span className="online-users">Online: {userList.length}</span>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.user === "System" ? "system-message" : ""}`}
              id={username === msg.user ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{msg.text}</p>
                </div>
                <div className="message-meta">
                  <p id="author">{msg.user}</p>
                  <p id="time">{msg.displayTime}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          placeholder="Type your message..."
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
