
import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";


export const sendMessageController=async(req,res)=>{
    const {content, chatId}=req.body;

    if(!chatId || !content){
        console.log("Invalid data passed into the request");
        res.status(400);
        return ;
    }

    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    try {
        var message=await messageModel.create(newMessage);

        message=await message.populate("sender","name pic");
        message=await message.populate("chat");

        message=await userModel.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })

        await chatModel.findByIdAndUpdate(chatId,{
            latestMessage:message
        })

        res.status(200).send(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

export const allMessages=async (req, res)=>{
    const {chatId}=req.params.chatId;

    try {
        const messages= await messageModel.find({chat:req.params.chatId}).populate("sender", "name pic email").populate("chat");

        res.status(200).send(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

}