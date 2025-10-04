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
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await Booking.updateMany(
    { status: "pending", createdAt: { $lt: twentyFourHoursAgo } },
    { status: "declined", declineReason: "Expired after 24 hours" }
  );
});