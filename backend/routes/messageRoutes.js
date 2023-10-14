import express from "express";
import { allMessages, sendMessageController } from "../controllers/messageControllers.js";
import { protect } from "../middlewares/authMiddlewares.js";
const router = express.Router();

router.post("/send",protect, sendMessageController);

 router.get("/get-messages/:chatId",protect, allMessages);


export default router;