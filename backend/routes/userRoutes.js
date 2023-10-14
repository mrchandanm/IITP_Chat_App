import express from "express";
import { loginController, registerController } from "../controllers/authControllers.js";
import { getAllUser } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddlewares.js";
//router object
const router = express.Router();

// Register || method POST
router.post("/register", registerController);

//Login || method POST
router.post("/login", loginController);

//get all user
router.get("/get-user",protect,getAllUser);

export default router;