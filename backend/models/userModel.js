import mongoose from "mongoose";

const userModel=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://www.pngkit.com/png/full/126-1262807_instagram-default-profile-picture-png.png"
    }
    

},{timestamps:true})

export default mongoose.model("User", userModel);