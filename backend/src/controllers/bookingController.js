import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Cook from "../models/Cook.js";
import { sendNotification } from "../utils/notifications.js";
import { verifyPayment } from "../utils/razorpay.js";

export const createBooking = async (req, res) => {
  try {
    if (req.user.type !== "user") {
      return res
        .status(403)
        .json({ message: "Only users can create bookings" });
    }

    const {
      cookId,
      mealType,
      guestCount,
      selectedDate,
      selectedTime,
      selectedCuisine,
      totalAmount,
      paymentId,
    } = req.body;

    if (
      !cookId ||
      !mealType ||
      !guestCount ||
      !selectedDate ||
      !selectedTime ||
      !selectedCuisine ||
      !totalAmount ||
      !paymentId
    ) {
      return res
        .status(400)
        .json({ message: "All booking fields are required" });
    }

    const paymentVerification = await verifyPayment(paymentId);
    if (
      !paymentVerification.valid ||
      paymentVerification.amount !== totalAmount
    ) {
      return res.status(400).json({
        message: "Invalid payment",
      });
    }

    const booking = new Booking({
      userId: req.user._id,
      cookId,
      mealType,
      guestCount,
      selectedDate,
      selectedTime, 
      selectedCuisine,
      totalAmount,
      paymentId,
    });

    await booking.save();

    const cook = await Cook.findById(cookId).select("username fcmToken");
    if (cook && cook.fcmToken) {
      await sendNotification(
        cook.fcmToken,
        "New Booking Request!",
        `Hi Chef ${cook.username}, you have a new booking from ${req.user.username} for ${mealType} (${guestCount} guests) on ${selectedDate} at ${selectedTime}. Please accept or decline in your app.`,
        { bookingId: booking._id.toString(), action: "view_booking" }
      );
    }
    
    await booking.populate(["userId", "cookId"]);

    res.status(201).json({ booking: booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    if (req.user.type !== "user") {
      return res
        .status(403)
        .json({ message: "Only users can view their bookings" });
    }
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("cookId", "username profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCookBookings = async (req, res) => {
  try {
    if (req.user.type !== "cook") {
      return res
        .status(403)
        .json({ message: "Only cooks can view their bookings" });
    }
    const bookings = await Booking.find({ cookId: req.user._id })
      .populate("userId", "username profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching cook bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    if (req.user.type !== "cook") {
      return res
        .status(403)
        .json({ message: "Only cooks can accept bookings" });
    }
    const { id } = req.params;
    const booking = await Booking.findOneAndUpdate(
      { _id: id, cookId: req.user._id, status: "pending" },
      { status: "accepted" },
      { new: true }
    ).populate("userId", "username fcmToken");

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or already handled" });
    }

    if (booking.userId && booking.userId.fcmToken) {
      await sendNotification(
        booking.userId.fcmToken,
        "Booking Accepted!",
        `Great news! Chef ${req.user.username} has accepted your ${booking.mealType} booking for ${booking.guestCount} guests on ${booking.selectedDate} at ${booking.selectedTime}.`,
        { bookingId: id, action: "booking_accepted" }
      );
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error("Error accepting booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const declineBooking = async (req, res) => {
  try {
    if (req.user.type !== "cook") {
      return res
        .status(403)
        .json({ message: "Only cooks can decline bookings" });
    }
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findOneAndUpdate(
      { _id: id, cookId: req.user._id, status: "pending" },
      { status: "declined", declineReason: reason || "" },
      { new: true }
    ).populate("userId", "username fcmToken");

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or already handled" });
    }

    if (booking.userId && booking.userId.fcmToken) {
      const reasonText = reason ? ` Reason: ${reason}` : "";
      await sendNotification(
        booking.userId.fcmToken,
        "Booking Declined",
        `Sorry, your ${booking.mealType} booking has been declined by Chef ${req.user.username}.${reasonText}`,
        { bookingId: id, action: "booking_declined" }
      );
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error("Error declining booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
