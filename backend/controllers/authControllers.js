
import { comparePassword, hashpasssword } from "../helpers/authHelpers.js";
import generateToken from "../config/generateToken.js";
import userModel from "../models/userModel.js";


export const registerController=async (req, res)=>{
   try {
    const {name, email, password, pic}=req.body;
    if(!name) return res.send({message:"name is required"});
    if(!email) return res.send({message:"email is required"});
    if(!password) return res.send({message:"password is required"});

     //checking user
     const existingUser= await userModel.findOne({email});
     //existing user
     if(existingUser){
         return res.status(401).send({
             success:false,
             message:"email already registerd"});      
     }
       //register user
    const hashedpasssword= await hashpasssword(password);
    const user =await new userModel({name,email,password:hashedpasssword, pic}).save();

     const token= await generateToken(user._id);
    res.status(200).send({
        success:true,
        message:"user registered succesfully",
        user,
        token
    })
   } catch (error) {
    console.log(error);
    res.status(400).send({
        success:false,
        message:"FAILED TO REGISTER",
        error,

    })
   }
}


export const loginController=async (req, res)=>{
try {
    const {email,password}=req.body;
    //validation
    if(!email || !password){
        res.status(400).send({
            success:false,
            message:"Invalid User Credentials"
        });
    }

     //check
     const user= await userModel.findOne({email});
     if(!user){
         return res.status(400).send({
             success:false,
             message:"Email is not registered"
         })
     }
     const match=await comparePassword(password,user.password);
     if(!match){
         return res.status(200).send({
             success:false,
             message:"Invalid password"
         })
     }


     //token
     const token=await generateToken(user._id);

     res.status(200).send({
        success:true,
        message:"login successfull",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            id:user._id,
        },
        token,

     })
} catch (error) {
    console.log(error);
    res.status(400).send({
        success:false,
        message:"FAILED TO LOGIN",
        error
    })
}
}