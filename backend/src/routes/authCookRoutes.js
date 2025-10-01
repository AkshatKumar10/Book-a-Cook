import express from "express";
import { registerCook, loginCook, getAllCooks, getCookById, getCooksByCuisine } from "../controllers/auth.cookController.js";
import upload from "../multer.js";
import protectRoute from "../middleware/auth.userMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profileImage"), registerCook);
router.post("/login", loginCook);
router.get("/getcooks",protectRoute, getAllCooks);
router.get("/:id", protectRoute, getCookById);
router.get('/cuisine/:cuisine',protectRoute, getCooksByCuisine);

export default router;
