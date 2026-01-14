import logger from "../../config/logger.js";
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
import { ERRORS, RES_MESSAGES } from "../../utility/constants/constants.js";
import { sendPopupResponse } from "../../utility/user/googleAuth.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";
import { sendTokens } from "../../utility/sendTokens.js";
import {
  enrichUserLocation,
  generateGoogleTokens,
  prepareGoogleResponse,
  validateGoogleLogin,
} from "./helpers/googleAuth.helper.js";
import { ENV } from "../../config/env.conf.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";

// Google Authentication controller
export const googleAuthController = async (req, res) => {
  const user = req.user;
  const FRONTEND_URL = ENV.FRONTEND_URL;

  try {
    if (!validateGoogleLogin(user, FRONTEND_URL, res)) {
      return;
    }

    const accessToken = await generateGoogleTokens(user, FRONTEND_URL, res);
    if (!accessToken) {
      return;
    }

    await enrichUserLocation(user);

    const response = prepareGoogleResponse(user, accessToken);

    sendPopupResponse(res, response, FRONTEND_URL);
  } catch (error) {
    logger.error(`Error: ${error.stack || error.message}`);
    sendPopupResponse(
      res,
      { error: ERRORS.AUTHENTICATION_FAILED.MSG },
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
      { message: `${RES_MESSAGES.OTP_SENT.MSG} to ${email}` },
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
    message: RES_MESSAGES.USER_LOGGED_IN.MSG,
    accessToken,
  };

  console.log(response);

  sendResponse(res, response, STATUS_CODE.SUCCESS);
});

// Resend OTP controller
export const resendOTPController = asyncHandler(async (req, res) => {
  await resednOtp(req.body);

  sendResponse(
    res,
    { message: RES_MESSAGES.OTP_RESENT.MSG },
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
  logger.http(`${req.method} ${req.originalUrl}`);
  const token = req.headers.authorization?.split(" ")[1];
  await handleLogout(res, "user_refreshToken", token);

  sendResponse(
    res,
    { message: RES_MESSAGES.USER_LOGGED_OUT.MSG },
    STATUS_CODE.SUCCESS
  );
});

// Send OTP
export const sendOtpController = asyncHandler(async (req, res) => {
  const email = await sendOtp(req.body);

  sendResponse(
    res,
    { message: `${RES_MESSAGES.OTP_SENT.MSG} to ${email}` },
    STATUS_CODE.CREATED
  );
});

// Forgot password
export const forgotPasswordController = asyncHandler(async (req, res) => {
  await forgotPassword(req.body);

  sendResponse(
    res,
    { message: RES_MESSAGES.PASSWORD_UPDATED.MSG },
    STATUS_CODE.SUCCESS
  );
});
