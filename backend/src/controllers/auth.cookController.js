import jwt from "jsonwebtoken";
import Cook from "../models/Cook.js";
import cloudinary from "../lib/cloudinary.js";

const generateToken = (cookId) => {
  return jwt.sign({ cookId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

export const registerCook = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      location,
      cuisineSpecialties,
      specialties,
      bio,
      experienceLevel,
      servicesOffered,
      pricing,
    } = req.body;

    if (!req.files?.document) {
      return res.status(400).json({ message: "Document (Aadhaar/PAN/Certificate) is required" });
    }

    const documentResult = await cloudinary.uploader.upload(req.files.document[0].path, {
      folder: "cooks/documents",
      resource_type: "auto",
    });

    let profileImage = `https://api.dicebear.com/7.x/avataaars/png?seed=${username}`;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "cooks",
        resource_type: "image",
      });
      profileImage = result.secure_url;
    }
    const parsedPricing = {
      perDish: parseFloat(pricing?.perDish) || 0,
      perHour: parseFloat(pricing?.perHour) || 0,
    };
    if (
      !username ||
      !email ||
      !password ||
      !location ||
      !cuisineSpecialties ||
      !specialties ||
      !experienceLevel ||
      !servicesOffered ||
      !bio ||
      !parsedPricing
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
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

    if (!Array.isArray(cuisineSpecialties) || cuisineSpecialties.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one cuisine specialty is required" });
    }

    if (!Array.isArray(specialties) || specialties.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one specialty is required" });
    }

    if (experienceLevel < 0) {
      return res
        .status(400)
        .json({ message: "Experience level cannot be negative" });
    }

    if (!Array.isArray(servicesOffered) || servicesOffered.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one service must be offered" });
    }

    const existingEmail = await Cook.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await Cook.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const cook = new Cook({
      username,
      email,
      password,
      profileImage,
      document: documentResult.secure_url,
      location,
      cuisineSpecialties,
      specialties,
      bio,
      experienceLevel,
      servicesOffered,
      pricing: parsedPricing,
    });

    await cook.save();
    const token = generateToken(cook._id);

    res.status(201).json({
      token,
      cook: {
        id: cook._id,
        username: cook.username,
        email: cook.email,
        profileImage: cook.profileImage,
        document: cook.document,
        location: cook.location,
        cuisineSpecialties: cook.cuisineSpecialties,
        specialties: cook.specialties,
        bio: cook.bio,
        experienceLevel: cook.experienceLevel,
        servicesOffered: cook.servicesOffered,
        pricing: cook.pricing,
        createdAt: cook.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in registerCook controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginCook = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cook = await Cook.findOne({ email });
    if (!cook) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await cook.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(cook._id);

    res.status(200).json({
      token,
      cook: {
        id: cook._id,
        username: cook.username,
        email: cook.email,
        profileImage: cook.profileImage,
        location: cook.location,
        cuisineSpecialties: cook.cuisineSpecialties,
        bio: cook.bio,
        experienceLevel: cook.experienceLevel,
        servicesOffered: cook.servicesOffered,
        pricing: cook.pricing,
        createdAt: cook.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in loginCook controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCooks = async (req, res) => {
  try {
    const cooks = await Cook.find().select("-password");
    const formattedCooks = cooks.map((cook) => ({
      id: cook._id,
      name: cook.username,
      cuisine: cook.cuisineSpecialties.join(", "),
      image: cook.profileImage,
      experienceLevel: cook.experienceLevel,
      pricing: cook.pricing,
      specialties: cook.specialties,
      bio: cook.bio,
      servicesOffered: cook.servicesOffered,
    }));
    res.status(200).json(formattedCooks);
  } catch (error) {
    console.log("Error in getAllCooks controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCookById = async (req, res) => {
  try {
    const { id } = req.params;
    const cook = await Cook.findById(id).select("-password");
    if (!cook) {
      return res.status(404).json({ message: "Cook not found" });
    }
    const formattedCook = {
      id: cook._id,
      name: cook.username,
      cuisine: cook.cuisineSpecialties.join(", "),
      specialties: cook.specialties.join(", "),
      image: cook.profileImage,
      location: cook.location,
      bio: cook.bio,
      experienceLevel: cook.experienceLevel,
      servicesOffered: cook.servicesOffered,
      pricing: cook.pricing,
      createdAt: cook.createdAt,
    };
    res.status(200).json(formattedCook);
  } catch (error) {
    console.log("Error in getCookById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCooksByCuisine = async (req, res) => {
  try {
    const { cuisine } = req.params;
    if (!cuisine) {
      return res.status(400).json({ message: "Cuisine is required" });
    }

    const cooks = await Cook.find({ cuisineSpecialties: cuisine }).select(
      "-password"
    );
    const formattedCooks = cooks.map((cook) => ({
      id: cook._id,
      name: cook.username,
      cuisine: cook.cuisineSpecialties.join(", "),
      image: cook.profileImage,
      experienceLevel: cook.experienceLevel,
      location: cook.location,
      bio: cook.bio,
      servicesOffered: cook.servicesOffered,
      specialties: cook.specialties,
      pricing: cook.pricing,
      createdAt: cook.createdAt,
    }));

    res.status(200).json(formattedCooks);
  } catch (error) {
    console.log("Error in getCooksByCuisine controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCookFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) {
      return res.status(400).json({ message: "FCM token is required" });
    }
    const updatedCook = await Cook.findByIdAndUpdate(
      req.user._id,
      { fcmToken },
      { new: true }
    ).select("-password");
    if (!updatedCook) {
      return res.status(404).json({ message: "Cook not found" });
    }
    res.status(200).json({
      cook: {
        id: updatedCook._id,
        username: updatedCook.username,
        email: updatedCook.email,
        profileImage: updatedCook.profileImage,
        fcmToken: updatedCook.fcmToken,
        location: updatedCook.location,
        cuisineSpecialties: updatedCook.cuisineSpecialties,
        specialties: updatedCook.specialties,
        bio: updatedCook.bio,
        experienceLevel: updatedCook.experienceLevel,
        servicesOffered: updatedCook.servicesOffered,
        pricing: updatedCook.pricing,
      },
    });
  } catch (error) {
    console.error("Error controller updating FCM token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCook = async (req, res) => {
  try {
    const cook = await Cook.findById(req.user._id).select("-password");
    if (!cook) {
      return res.status(404).json({ message: "Cook not found" });
    }
    const formattedCook = {
      id: cook._id,
      email: cook.email,
      name: cook.username,
      cuisine: cook.cuisineSpecialties.join(", "),
      specialties: cook.specialties.join(", "),
      image: cook.profileImage,
      location: cook.location,
      bio: cook.bio,
      experienceLevel: cook.experienceLevel,
      servicesOffered: cook.servicesOffered,
      pricing: cook.pricing,
      createdAt: cook.createdAt,
    };
    res.status(200).json(formattedCook);
  } catch (error) {
    console.log("Error in getCook controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCookProfile = async (req, res) => {
  try {
    const {
      username,
      email,
      location,
      cuisineSpecialties,
      specialties,
      bio,
      experienceLevel,
      servicesOffered,
      pricing,
    } = req.body;

    let profileImage = req.user.profileImage;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "cooks",
        resource_type: "image",
      });
      profileImage = result.secure_url;
    }

    if (!username || !email || !location || !bio) {
      return res
        .status(400)
        .json({ message: "Username, email, location, and bio are required" });
    }

    const existingEmail = await Cook.findOne({ email });
    if (
      existingEmail &&
      existingEmail._id.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    if (!Array.isArray(cuisineSpecialties) || cuisineSpecialties.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one cuisine specialty is required" });
    }

    if (!Array.isArray(servicesOffered) || servicesOffered.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one service must be offered" });
    }

    const parsedPricing = {
      perDish: parseFloat(pricing?.perDish) || 0,
      perHour: parseFloat(pricing?.perHour) || 0,
    };

    const updatedCook = await Cook.findByIdAndUpdate(
      req.user._id,
      {
        username,
        email,
        profileImage,
        location,
        cuisineSpecialties,
        specialties,
        bio,
        experienceLevel: parseInt(experienceLevel),
        servicesOffered,
        pricing: parsedPricing,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedCook) {
      return res.status(404).json({ message: "Cook not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      cook: {
        id: updatedCook._id,
        username: updatedCook.username,
        email: updatedCook.email,
        profileImage: updatedCook.profileImage,
        location: updatedCook.location,
        cuisineSpecialties: updatedCook.cuisineSpecialties,
        specialties: updatedCook.specialties,
        bio: updatedCook.bio,
        experienceLevel: updatedCook.experienceLevel,
        servicesOffered: updatedCook.servicesOffered,
        pricing: updatedCook.pricing,
        createdAt: updatedCook.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in updateCookProfile controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
