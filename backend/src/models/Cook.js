import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const cookSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: true,
    },
    cuisineSpecialties: {
      type: [String],
      required: true,
      default: [],
    },
    specialties: {
      type: [String],
      required: true,
      default: [],
    },
    bio: {
      type: String,
      required: true,
      default: "",
    },
    experienceLevel: {
      type: Number,
      required: true,
      min: 0,
    },
    servicesOffered: {
      type: [String],
      required: true,
      default: [],
    },
    pricing: {
      type: Map,
      of: Number,
      required: true,
      default: {},
    },
    fcmToken: { 
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

cookSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

cookSchema.methods.comparePassword = async function (cookPassword) {
  return await bcrypt.compare(cookPassword, this.password);
};

const Cook = mongoose.model.Cook || mongoose.model("Cook", cookSchema);

export default Cook;