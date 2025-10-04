import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
  updateUserFcmToken,
  updateUserProfile,
} from "../controllers/auth.userController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protectRoute, getUser);
router.put("/user", protectRoute, updateUserProfile); 
router.post("/update-fcm", protectRoute, updateUserFcmToken);

export default router;
