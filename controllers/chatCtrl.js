const ChatRoom = require("../models/chatModel");

// Controller for sending a message
messageController = async (req, res) => {
  const { roomID } = req.params;
  const { user, text } = req.body;
  console.log(roomID);
  try {
    const chatRoom = await ChatRoom.findOne({ roomID });

    if (!chatRoom) {
      // Create a new chat room if it doesn't exist
      const newChatRoom = new ChatRoom({ roomID, messages: [] });
      console.log(newChatRoom);
      await newChatRoom.save();
    }

    // Add the new message to the chat room
    await ChatRoom.updateOne(
      { roomID },
      { $push: { messages: { user, text } } }
    );

    // Emit the message to all connected clients in the room (using socket.io)

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

// Controller for retrieving chat history
historyController = async (req, res) => {
  const { roomID } = req.params;

  try {
    const chatRoom = await ChatRoom.findOne({ roomID });

    if (!chatRoom) {
      // Create a new chat room if it doesn't exist
      const newChatRoom = new ChatRoom({ roomID, messages: [] });
      console.log(newChatRoom);
      await newChatRoom.save();
      res
        .status(200)
        .json({ success: true, chatHistory: newchatRoom.messages });
    } else {
      res.status(200).json({ success: true, chatHistory: chatRoom.messages });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve chat history" });
  }
};

module.exports = { messageController, historyController };
