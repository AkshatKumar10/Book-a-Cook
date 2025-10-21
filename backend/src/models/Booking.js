import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cook",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending",
    },
    mealType: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedDate: {
      type: String,
      required: true,
    },
    selectedTime: {
      type: String,
      required: true,
    },
    selectedCuisine: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    declineReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
