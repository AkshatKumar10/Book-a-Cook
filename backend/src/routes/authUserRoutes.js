import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/auth.userController.js";
import protectRoute from "../middleware/auth.userMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protectRoute, getUser);
router.put("/user", protectRoute, updateUserProfile); 

export default router;
