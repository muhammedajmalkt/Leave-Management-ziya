import { Router } from "express";
import { createUser, loginUser, } from "../controllers/userController.js";
import { asyncErrorhandler } from "../middlewares/asyncErrorhandler.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post("/",upload.single("profileImage"), asyncErrorhandler(createUser)); 
router.post("/login", asyncErrorhandler(loginUser));

  

export default router;
