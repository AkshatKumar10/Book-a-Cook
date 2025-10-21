import express from "express";
import cors from "cors";
import "dotenv/config";
import authUserRoutes from "./routes/authUserRoutes.js";
import cookRoutes from "./routes/authCookRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { connectDB } from "./lib/db.js";
import cron from "node-cron";
import Booking from "./models/Booking.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authUserRoutes);
app.use("/api/cook", cookRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    await Booking.updateMany(
      { status: "pending", createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      { status: "declined", declineReason: "Expired after 24 hours" }
    );

    const bookings = await Booking.find({ status: "accepted" });
    for (const booking of bookings) {
      const [day, month, year] = booking.selectedDate.split("/").map(Number);
      const [hours, minutes] = booking.selectedTime
        .replace(/(am|pm)/i, "")
        .trim()
        .split(":")
        .map(Number);
      const period = booking.selectedTime.toLowerCase().includes("pm") ? "PM" : "AM";
      let adjustedHours = hours;
      if (period === "PM" && hours !== 12) adjustedHours += 12;
      if (period === "AM" && hours === 12) adjustedHours = 0;
      const bookingDateTime = new Date(year, month - 1, day, adjustedHours, minutes);

      if (bookingDateTime < now) {
        await Booking.updateOne({ _id: booking._id }, { status: "completed" });
      }
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});