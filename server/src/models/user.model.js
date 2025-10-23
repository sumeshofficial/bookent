import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null,
    trim: true,
  },
  authProvider: {
    type: String,
    enum: ["google", "email"],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  preferences: {
    type: Object,
    default: {},
  },
  totalSpentings: {
    type: Number,
    default: 0,
  },
  totalBookings: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
});

// Password bcrypt/hash
userSchema.pre("save", async function (next) {
  try {
    if (!this.password || !this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

// Passowrd compare
userSchema.methods.isValidPassword = async function (password) {
  try {
    if(!this.password) return false;
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.model("User", userSchema);

export default User;