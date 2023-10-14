import userModel from "../models/userModel.js";


//api/user/get-user?search=name
export const getAllUser=async (req,res)=>{
    const keyword=req.query.search ?{
        $or: [
            {name :{$regex: req.query.search, $options:"i" }},
            {email :{$regex: req.query.search, $options:"i" }}
        ],
    }
    :{};

    const users= await userModel.find(keyword).find({_id:{$ne: req.user._id}});
    res.send(users);


}