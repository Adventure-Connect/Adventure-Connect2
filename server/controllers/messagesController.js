const Message  = require("../models/messageModel");

const MessageController ={
    async addMessage(req,res,next){
        try{
            const {from, to, message} = req.body;
            const data = await Message.create({
                message: {text:message},
                users: [from,to],
                sender: from,
            });
            if(data) return res.json({msg: "Message added sucessfully"});
            return res.json({msg: "Failed to add message to the db"});

        }
        catch(err){
            return next({
                log: "Express error handler caught middleware error when adding new Message",
                message: { err: "Could not Post Message" },
              });
        }
    },
    async getAllMessages(req,res,next){
        try{
            const { from, to } = req.body;
            const message = await messageModel.find({
                users:{
                    $all: [from, to],
                },
            }).sort({updatedAt:1})
            const projectMessages = messages.map((msg) =>{
                return{
                    fromSelf: msg.sender.toString() === from,
                    message: msg.message.text,
                }
            })
            res.json(projectMessages)
        }
        catch(err){
            return next({
                log: "Express error handler caught middleware error when getting ALL Messages",
                message: { err: "Could not Post/ Get ALL Messages" },
              });
        }

    }
};

module.exports = MessageController;