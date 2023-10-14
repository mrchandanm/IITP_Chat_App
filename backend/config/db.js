import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB=async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,

        });
        console.log(`connection successful on port ${conn.connection.host}`.bgGreen)
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;