import express from "express";
import { protect } from "../middlewares/authMiddlewares.js";
import { accessChat, addInGroup, createGroupChat, fetchChat, removeFromGroup, renameGroup } from "../controllers/chatControllers.js";
//router object
const router = express.Router();

router.post("/",protect ,accessChat);
router.get("/",protect, fetchChat);

router.post("/group",protect ,createGroupChat);
router.put("/rename-group",protect ,renameGroup);
router.put("/remove-from-group",protect ,removeFromGroup);
router.put("/add-in-group",protect ,addInGroup);


export default router;