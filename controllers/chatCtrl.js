const ChatRoom = require("../models/chatModel");

// Controller for sending a message
const messageController = async (req, res) => {
  const { roomID } = req.params;
  const { user, text, timestamp } = req.body;

  try {
    let chatRoom = await ChatRoom.findOne({ roomID });

    if (!chatRoom) {
      // Create a new chat room if it doesn't exist
      chatRoom = new ChatRoom({ roomID, messages: [] });
      await chatRoom.save();
    }

    // Add the new message to the chat room
    const message = {
      user,
      text,
      timestamp: timestamp || new Date().toLocaleString()
    };

    chatRoom.messages.push(message);
    await chatRoom.save();

    res.status(200).json({ 
      success: true, 
      message: "Message saved successfully",
      savedMessage: message
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, message: "Failed to save message" });
  }
};

// Controller for retrieving chat history
const historyController = async (req, res) => {
  const { roomID } = req.params;

  try {
    const chatRoom = await ChatRoom.findOne({ roomID });

    if (!chatRoom) {
      // Return empty history for new chat rooms
      return res.status(200).json({ 
        success: true, 
        chatHistory: [] 
      });
    }

    res.status(200).json({ 
      success: true, 
      chatHistory: chatRoom.messages 
    });
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve chat history" 
    });
  }
};

module.exports = { messageController, historyController };
