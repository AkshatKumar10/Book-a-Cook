import express from "express";
import cors from "cors";
import "dotenv/config";
import authUserRoutes from "./routes/authUserRoutes.js";
import cookRoutes from "./routes/authCookRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { connectDB } from "./lib/db.js";
import bookingCron from "./cron/bookingCron.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authUserRoutes);
app.use("/api/cook", cookRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    bookingCron();
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();

