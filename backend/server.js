import express from "express";
import colors from 'colors';
import dotenv from 'dotenv'
import morgan from "morgan";
import cors from 'cors';
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from  "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import { Server } from "socket.io";
import http from "http"

const app =express();
const server=http.createServer(app);
dotenv.config();
connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT=process.env.PORT || 8080;

app.use("/api/user", userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)

//for testing
// app.get("/", (req,res)=>{
//     res.send("this is server");
// })

// app.get("api/chat/:id",(req,res)=>{
//     console.log(req.params.id);  //we can get id with (req.params.id) then this id we can use to find the user
    
// })





var io=new Server(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials:true,
    },
    allowEIO3: true
});

io.on("connection", (socket)=>{
    console.log("connected to socket.io");

    socket.on('setup', (userData)=>{
        // we are getting data from frontend on path "setup" and then after useing it we can send response to frontend by {socket.emit()} then we can get data in frontend by using socket.on("setup",(data)=>{})
        socket.join(userData.id);  
        console.log(userData.id);
        socket.emit("connected")
    });

    socket.on("join-chat",(room)=>{
        socket.join(room);  //to create room using join with a room id

        console.log("user joind room : " + room)
    });

    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))

    socket.on("new message", (newMessageReceived)=>{
         // chat from message model
        var chat=newMessageReceived.chat;

        if(!chat.users) return console.log("no user")

       chat.users.forEach(user=>{
        if(user._id == newMessageReceived.sender._id)return;

        socket.in(user._id).emit("message received", newMessageReceived)
       })
    }) 
})

server.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`.bgYellow);
})


