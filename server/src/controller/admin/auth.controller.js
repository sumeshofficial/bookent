import dotenv from "dotenv";
import { finduser, handleLogout } from "../../services/auth.service.js";
import { sendTokens } from "../../utility/sendTokens.js";
import {
  revokeRefreshToken,
  verifyRefreshToken,
} from "../../services/token.service.js";
import { statusCode } from "../../utility/constants/statusCode.js";
import logger from "../../config/logger.js";
dotenv.config();

// Generate RefreshAccessToken for admin
export const refreshAccessTokenForAdmin = async (req, res) => {
  try {
    const token = req.cookies.admin_refreshToken;
    if (!token) {
      logger.warn(`Missing refresh token for admin`);
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Missing Refresh Token",
      });
    }

    logger.info("Verifing refresh roken");
    const payload = await verifyRefreshToken(token);

    if (!payload) {
      logger.warn("Invalid or expired refresh token for admin");
      return res.status(statusCode.unAuthorized).json({
        success: false,
        error: "Invalid or expired refresh token",
      });
    }

    logger.info(
      `Remove old refresh token from db for userId=${payload.userId} email=${payload.role}`
    );
    await revokeRefreshToken(payload.tokenId);

    const user = {
      _id: payload.userId,
      role: payload.role,
    };

    logger.info(
      `Regenerate new refresh and accesstoken for userId=${payload.userId} email=${payload.role}`
    );
    const newAccessToken = await sendTokens(res, user);

    logger.info(
      `Regenerating refresh and access token successfully for userId=${payload.userId} email=${payload.role}`
    );
    res.status(statusCode.success).json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error(
      `Error Regenerating access token and refresh token: ${error.stack || error.message}`
    );
    res.status(statusCode.serverError).json({
      success: false,
      error: "Invalid or expired refresh token",
    });
  }
};

// Admin logout
export const logoutAdmin = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);
    const token = req.headers.authorization?.split(" ")[1];

    logger.info(`Logout Admin`);
    await handleLogout(res, "admin_refreshToken", token);

    logger.info(`Admin logged out successfully`);
    res.status(statusCode.success).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    logger.error(`Error logout admin: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Something went wrong" });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(statusCode.missingField)
        .json({ success: false, message: "Missing fields" });
    }

    const user = await finduser(email);

    if (!user) {
      return res
        .status(statusCode.badRequest)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(statusCode.permissionDenied)
        .json({ success: false, message: "Access denied. Not an admin." });
    }

    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res
        .status(statusCode.unAuthorized)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = await sendTokens(res, user);

    return res.status(statusCode.success).json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(statusCode.serverError).json({
      success: false,
      error: error.messsage || "Something went wrong",
    });
  }
};
