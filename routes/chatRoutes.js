const express = require("express");

const {
  messageController,
  historyController,
} = require("../controllers/chatCtrl");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

// API endpoint for sending a message
router.post("/:roomID/message", authMiddleware, messageController);

// API endpoint for retrieving chat history
router.get("/:roomID/history", authMiddleware, historyController);

module.exports = router;
