import express from "express";
import cors from "cors";
import "dotenv/config";
import authUserRoutes from "./routes/authUserRoutes.js";
import cookRoutes from "./routes/authCookRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authUserRoutes);
app.use("/api/cook", cookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
