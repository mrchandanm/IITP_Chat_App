import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const protect=async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token =req.headers.authorization.split(" ")[1];

            const decode= JWT.verify(token,process.env.JWT_SECRET);

            req.user= await userModel.findById(decode._id).select("-password");
            next();
            
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
            console.log(error)
        }
    }
    if(!token){
        res.status(401).send({
            succes:false,
            message:"authorization failed",
        })
    }
}