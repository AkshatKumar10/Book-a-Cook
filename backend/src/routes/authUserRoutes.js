import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
  updateUserFcmToken,
  updateUserProfile,
  bookmarkCook,
  unbookmarkCook,
  getBookmarkedCooks,
} from "../controllers/auth.userController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protectRoute, getUser);
router.put("/user", protectRoute, updateUserProfile); 
router.post("/update-fcm", protectRoute, updateUserFcmToken);
router.post("/bookmark-cook", protectRoute, bookmarkCook);
router.post("/unbookmark-cook", protectRoute, unbookmarkCook);
router.get("/bookmarked-cooks", protectRoute, getBookmarkedCooks);

export default router;
