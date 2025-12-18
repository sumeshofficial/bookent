import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { AppError } from "../utility/helpers.js";
import { STATUS_CODE } from "../utility/constants/statusCode.js";
import { ERRORS } from "../utility/constants/constants.js";

// User Schema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
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
      default: null,
    },
    location: {
      type: Object,
      default: null,
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
    preferences: {
      type: Object,
      default: {},
    },
    spending: {
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
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    wallet: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Password bcrypt/hash
userSchema.pre("save", async function (next) {
  try {
    if (!this.password || !this.isModified("password")) {
      return next();
    }

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
    if (!this.password) {
      return false;
    }
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.PASSWORD_COMPARISON_ERROR.CODE,
      error.message || ERRORS.PASSWORD_COMPARISON_ERROR.MSG
    );
  }
};

const User = mongoose.model("User", userSchema);

export default User;
