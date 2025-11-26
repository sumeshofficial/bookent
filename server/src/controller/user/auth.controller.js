import logger from "../../config/logger.js";
import { reverseGeocoding } from "../../services/user.service.js";
import {
  forgotPassword,
  handleLogout,
  handleOtpPurpose,
  refreshAccessToken,
  resednOtp,
  sendOtp,
  signinUser,
  signupUser,
  validateOtpRequest,
  verifyOtp,
} from "../../services/user/auth.service.js";
import { STATUS_CODE, statusCode } from "../../utility/constants.js";
import {
  sendPopupResponse,
  validateGoogleUser,
} from "../../utility/user/googleAuth.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";
import { sendTokens } from "../../utility/sendTokens.js";
import { sanitizeUser } from "../../utility/user/sanitizeUser.js";

// Google Authentication controller
export const googleAuthController = async (req, res) => {
  const user = req.user;
  const FRONTEND_URL = process.env.FRONTEND_URL;

  try {
    const validationError = validateGoogleUser(user);
    if (validationError) {
      return sendPopupResponse(res, validationError, FRONTEND_URL);
    }

    const accessToken = await sendTokens(res, user);
    if (!accessToken) {
      return sendPopupResponse(
        res,
        { error: "Token generation failed" },
        FRONTEND_URL
      );
    }

    if (user.role === "user" && user.location) {
      const geoAddress = await reverseGeocoding({
        lat: user.location.latitude,
        lng: user.location.longitude,
      });

      user.location.address = geoAddress;
    }

    const safeUser = sanitizeUser(user);

    return sendPopupResponse(
      res,
      { accessToken, user: safeUser },
      FRONTEND_URL
    );
  } catch (error) {
    logger.error(`Error: ${error.stack || error.message}`);
    return sendPopupResponse(
      res,
      { error: "Authentication failed. Please try again." },
      FRONTEND_URL
    );
  }
};

// User signup with email controller
export const registerUserWithEmailController = asyncHandler(
  async (req, res) => {
    const email = await signupUser(req.body);

    sendResponse(
      res,
      { message: `OTP sent successfully to ${email}` },
      STATUS_CODE.CREATED
    );
  }
);

// Login with email
export const loginwithEmailController = asyncHandler(async (req, res) => {
  const user = await signinUser(req.body);

  const accessToken = await sendTokens(res, user);

  const response = {
    user,
    message: "User logged in successfully",
    accessToken,
  };

  sendResponse(res, response, STATUS_CODE.SUCCESS);
});

// Resend OTP controller
export const resendOTPController = asyncHandler(async (req, res) => {
  await resednOtp(req.body);

  sendResponse(
    res,
    { message: "OTP resent successfully" },
    STATUS_CODE.CREATED
  );
});

// Verify OTP controller
export const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp, purpose } = req.body;

  validateOtpRequest({ email, otp, purpose });

  const userData = await verifyOtp({ email, otp, purpose });

  const response = await handleOtpPurpose({ purpose, userData, res });

  sendResponse(res, response, STATUS_CODE.SUCCESS);
});

// Generate RefreshAccessToken
export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const token = req.cookies.user_refreshToken;
  const user = await refreshAccessToken(token);

  const newAccessToken = await sendTokens(res, user);

  sendResponse(res, { accessToken: newAccessToken }, STATUS_CODE.SUCCESS);
});

// Logout controller
export const logoutUserController = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  await handleLogout(res, "user_refreshToken", token);

  sendResponse(
    res,
    { message: "User logged out successfully" },
    STATUS_CODE.SUCCESS
  );
});

// Send OTP
export const sendOtpController = asyncHandler(async (req, res) => {
  const email = await sendOtp(req.body);

  sendResponse(
    res,
    { message: `OTP sent successfully to ${email}` },
    STATUS_CODE.CREATED
  );
});

// Forgot password
export const forgotPasswordController = asyncHandler(async (req, res) => {
  await forgotPassword(req.body);

  res.status(statusCode.success).json({
    message: "Password updated successfully",
  });
});
