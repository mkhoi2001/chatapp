const express = require("express");
const sendMessageController = require("../controllers/messageController");

const router = express.Router();
router.post("/sendTextMessage", sendMessageController.sendTextMessage);
router.post("/sendImageMessage", sendMessageController.sendImageMessage);
router.post('/getMessage', sendMessageController.getMessage);
router.post('/getAllConversations',sendMessageController.getAllConversations);

module.exports = router;
