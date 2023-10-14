import { ChangeStream } from "mongodb";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";


export const accessChat=async (req,res)=>{
   const {userId}=req.body;  //sending from body or we can also send as params
   if(!userId){
    console.log("userId params not send with request");
    return res.status(400);
   }


   var isChat = await chatModel.find({
    isGroupChat:false,
    $and:[
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:userId}}}
    ]
   }).populate("users","-password").populate("latestMessage");

   isChat = await userModel.populate(isChat,{
    path:'latestMessage.sender',
    select:"name pic email"
   });

   if(isChat.length>0){
    res.status(200).send(isChat[0]);
   }
   else{
    //we gonna create new chat is chat does.nt exist
    var chatData={
        chatName:"sender",
        isGroupChat:false,
        users:[req.user._id,userId]
    };

    try {
        const createdChat= await chatModel.create(chatData);
        const fullChat=await chatModel.find({_id:createdChat._id}).populate("users","-password");

        res.status(200).send(fullChat);
    } catch (error) {
        console.log(error);
        res.status(401).send({
            succes:false,
            messsage:error.message,
        })
    }
   }

}

export const fetchChat=async (req,res)=>{
    try {
        //different way of sending data by then
        chatModel.find({users:{$elemMatch: {$eq: req.user._id}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt:-1}).then(async (result)=>{
            result=await userModel.populate(result,{
                path:'latestMessage.sender',
                select:"name pic email"
               });

               res.status(200).send(
                result
               );
        })  

        //to populate inside a field
    

          

    } catch (error) {
        console.log(error);
        res.status(400).send({
            succes:false,
            messsage:"failed to fetch chats"
        })
    }
}

export const createGroupChat=async (req,res)=>{

    if(!req.body.users || !req.body.name){
        return res.status(401).send({
            succes:false,
            message:"please fill all the fields"
        })
    }

    var users=JSON.parse(req.body.users);

    if(users.length <2){
        return res.status(401).send({
            succes:false,
            message:"more than two users are required"
        })
    }

    users.push(req.user);


    var groupChat={
        chatName:req.body.name,
        isGroupChat:true,
        users:users,
        groupAdmin:req.user,
    };

    try {
        const createdGroupChat= await chatModel.create(groupChat);
        const fullGroupChat=await chatModel.find({_id:createdGroupChat._id}).populate("users","-password").populate("groupAdmin", "-password");

        res.status(200).send(fullGroupChat);
    } catch (error) {
        console.log(error);
        res.status(401).send({
            succes:false,
            messsage:error.message,
        })
    }
}

export const renameGroup=async (req,res)=>{
    const {chatId, chatName}=req.body;

    const updateName= await chatModel.findByIdAndUpdate(chatId,{chatName},{new:true}).populate("users","-password").populate("groupAdmin", "-password");

    if(!updateName){
        res.status(400).send({
            succes:true,
            message:"chat not found"
        })
        return;
    }
    else{
        res.status(200).send({
            succes:true,
            message:"chat Name updated successfuly",
            updateName
        })
    }

}

export const addInGroup=async (req,res)=>{

    const{chatId, userId}=req.body;

    const added= await chatModel.findByIdAndUpdate(chatId,{
        $push:{users:userId},
    }, {new:true}).populate("users","-password").populate("groupAdmin", "-password");

    if(!added){
        res.status(400).send({
            succes:true,
            message:"chat not found"
        })
        return;
    }
    else{
        res.status(200).send({
            succes:true,
            message:"user added successfuly",
            added
        })
    }

}


export const removeFromGroup=async (req,res)=>{
  const{chatId, userId}=req.body;
  const removed=await chatModel.findByIdAndUpdate(chatId,{
    $pull:{users:userId},
}, {new:true}).populate("users","-password").populate("groupAdmin", "-password");

if(!removed){
    res.status(400).send({
        succes:true,
        message:"chat not found"
    })
    return;
}
else{
    res.status(200).send({
        succes:true,
        message:"user removed successfuly",
        removed
    })
}
}
