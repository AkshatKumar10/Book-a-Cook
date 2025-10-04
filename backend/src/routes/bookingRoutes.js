import express from "express";
import {
  createBooking,
  getUserBookings,
  getCookBookings,
  acceptBooking,
  declineBooking,
} from "../controllers/bookingController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createBooking);
router.get("/user", protectRoute, getUserBookings);

router.get("/cook", protectRoute, getCookBookings);
router.put("/cook/:id/accept", protectRoute, acceptBooking);
router.put("/cook/:id/decline", protectRoute, declineBooking);

export default router;