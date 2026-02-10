import Cook from "../models/Cook.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username should be at least 3 characters long" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const profileImage = `https://api.dicebear.com/7.x/avataaars/png?seed=${username}`;

    const user = new User({
      email,
      username,
      password,
      profileImage,
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in register controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = req.user;

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in getUser controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existingEmail = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const existingUsername = await User.findOne({
      username,
      _id: { $ne: req.user._id },
    });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ message: "FCM token is required" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fcmToken },
      { new: true }
    ).select("-password");
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user controller FCM token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bookmarkCook = async (req, res) => {
  try {
    const { cookId } = req.body;
    if (!cookId) {
      return res.status(400).json({ message: "Cook ID is required" });
    }

    const cook = await Cook.findById(cookId);
    if (!cook) {
      return res.status(404).json({ message: "Cook not found" });
    }

    const user = await User.findById(req.user._id);
    if (user.bookmarkedCooks.includes(cookId)) {
      return res.status(400).json({ message: "Cook already bookmarked" });
    }

    user.bookmarkedCooks.push(cookId);
    await user.save();

    res.status(200).json({ message: "Cook bookmarked successfully" });
  } catch (error) {
    console.error("Error bookmarking cook:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unbookmarkCook = async (req, res) => {
  try {
    const { cookId } = req.body;
    if (!cookId) {
      return res.status(400).json({ message: "Cook ID is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user.bookmarkedCooks.includes(cookId)) {
      return res.status(400).json({ message: "Cook not bookmarked" });
    }

    user.bookmarkedCooks = user.bookmarkedCooks.filter(
      (id) => id.toString() !== cookId
    );
    await user.save();

    res.status(200).json({ message: "Cook unbookmarked successfully" });
  } catch (error) {
    console.error("Error unbookmarking cook:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookmarkedCooks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("bookmarkedCooks", "-password")
      .select("-password");
    const formattedCooks = user.bookmarkedCooks.map((cook) => ({
      id: cook._id,
      name: cook.username,
      cuisine: cook.cuisineSpecialties.join(", "),
      image: cook.profileImage,
      experienceLevel: cook.experienceLevel,
      pricing: cook.pricing,
      specialties: cook.specialties,
      bio: cook.bio,
      servicesOffered: cook.servicesOffered,
      location: cook.location,
      createdAt: cook.createdAt,
    }));

    res.status(200).json({ bookmarkedCooks: formattedCooks });
  } catch (error) {
    console.error("Error fetching bookmarked cooks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};