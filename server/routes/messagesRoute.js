const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messagesController")

//Get all Messages for a specific chat -> he has this as a post 3:26:47
router.post("/getMsgs", messageController.getAllMessages, (req, res) => {
    res.status(200);
  });
//Post a message
router.post("/addMsg", messageController.addMessage, (req, res) => {
    res.status(200);
  });

module.exports = router;