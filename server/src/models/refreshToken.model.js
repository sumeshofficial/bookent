import mongoose from "mongoose";

// Refresh Token
const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;
