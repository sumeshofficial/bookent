import dotenv from "dotenv";
import { handleLogout } from "../../services/auth.service.js";
import { sendTokens } from "../../utility/sendTokens.js";
import {
  revokeRefreshToken,
  verifyRefreshToken,
} from "../../services/token.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import logger from "../../config/logger.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";
import { finduser } from "../../repositories/user/user.repository.js";
dotenv.config();

// Generate RefreshAccessToken for admin
export const refreshAccessTokenForAdmin = asyncHandler(async (req, res) => {
  const token = req.cookies.admin_refreshToken;
  if (!token) {
    return res.status(STATUS_CODE.MISSING_FIELD).json({
      success: false,
      error: "Missing Refresh Token",
    });
  }

  const payload = await verifyRefreshToken(token);

  if (!payload) {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      error: "Invalid or expired refresh token",
    });
  }

  await revokeRefreshToken(payload.tokenId);

  const user = {
    _id: payload.userId,
    role: payload.role,
  };

  const newAccessToken = await sendTokens(res, user);

  sendResponse(res, { accessToken: newAccessToken }, STATUS_CODE.SUCCESS);
});

// Admin logout
export const logoutAdmin = asyncHandler(async (req, res) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  const token = req.headers.authorization?.split(" ")[1];

  logger.info(`Logout Admin`);
  await handleLogout(res, "admin_refreshToken", token);

  logger.info(`Admin logged out successfully`);
  res.status(STATUS_CODE.SUCCESS).json({
    success: true,
    message: "Admin logged out successfully",
  });
});

// Admin login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(STATUS_CODE.MISSING_FIELD)
      .json({ success: false, message: "Missing fields" });
  }

  const user = await finduser(email);

  if (!user) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ success: false, message: "User not found" });
  }

  if (user.role !== "admin") {
    return res
      .status(STATUS_CODE.PERMISSION_DENIED)
      .json({ success: false, message: "Access denied. Not an admin." });
  }

  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ success: false, message: "Invalid credentials" });
  }

  const accessToken = await sendTokens(res, user);

  sendResponse(
    res,
    {
      admin: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
    STATUS_CODE.SUCCESS
  );
});
