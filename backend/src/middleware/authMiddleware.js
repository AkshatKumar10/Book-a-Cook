import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Cook from "../models/Cook.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    if (decoded.userId) {
      user = await User.findById(decoded.userId).select("-password");
      if (!user) return res.status(401).json({ message: "Token is not valid" });
      req.user = { ...user.toObject(), type: "user" };
    } else if (decoded.cookId) {
      user = await Cook.findById(decoded.cookId).select("-password");
      if (!user) return res.status(401).json({ message: "Token is not valid" });
      req.user = { ...user.toObject(), type: "cook" };
    } else {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    console.error("Authentication error hjbdsib:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default protectRoute;