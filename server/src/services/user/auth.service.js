import {
  createUser,
  finduser,
  findUserByEmail,
  isUserExists,
  updatePassword,
} from "../../repositories/user/user.repository.js";
import { STATUS_CODE } from "../../utility/constants.js";
import { AppError } from "../../utility/helpers.js";
import { checkOtp, generateOtp, delOtp } from "../notifications/otp.service.js";
import { sendTokens } from "../../utility/sendTokens.js";
import {
  blacklistToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../token.service.js";
import { sanitizeUser } from "../../utility/user/sanitizeUser.js";
import jwt from "jsonwebtoken";

// Signup user service
export const signupUser = async (data) => {
  const { fullname, email, password, purpose, role = "user" } = data;

  if (!fullname || !email || !password || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "fullname, email, password, purpose fields are required."
    );
  }

  if (await isUserExists(email)) {
    throw new AppError(
      STATUS_CODE.CONFLICT,
      "EMAIL_ALREADY_EXISTS",
      "A user with this email address already exists."
    );
  }

  const userData = { fullname, email, password, role, authProvider: "email" };

  await generateOtp({ email, userData, purpose });

  return email;
};

// Signin user service
export const signinUser = async (data) => {
  const { email, password, purpose } = data;

  if (!email || !password || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "email, purpose and password required."
    );
  }

  const user = await finduser(email);

  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "USER_NOT_FOUND",
      "User not found"
    );
  }

  const isPasswordValid = await user.isValidPassword(password);

  if (!isPasswordValid) {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      "INVALID_CREDENTIALS",
      "Invalid credentials"
    );
  }

  if (user.status === "blocked") {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      "USER_BLOCKED",
      "You are blocked by the admin"
    );
  }

  const updatedUser = sanitizeUser(user);

  return updatedUser;
};

// Resend otp service
export const resednOtp = async (data) => {
  const { email, purpose } = data;

  if (!email || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "email and purpose are required."
    );
  }

  const userData = await checkOtp(email, purpose);

  if (!userData) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "NO_PENDING_OTP",
      "No pending OTP found for user."
    );
  }

  await generateOtp({ email, userData, purpose });
};

// Validate otp sevice
export const validateOtpRequest = ({ email, otp, purpose }) => {
  if (!email || !otp || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "email, purpose and otp are required"
    );
  }
};

// Verify otp service
export const verifyOtp = async ({ email, otp, purpose }) => {
  const userData = await checkOtp(email, purpose);

  if (!userData) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "OTP_EXPIRED",
      "OTP expired or not found"
    );
  }

  if (userData.otp !== otp || userData.purpose !== purpose) {
    throw new AppError(STATUS_CODE.BAD_REQUEST, "OTP_INVALID", "Invalid OTP");
  }

  await delOtp(email, purpose);

  return userData;
};

// Handle otp purpose
export const handleOtpPurpose = async ({ purpose, userData, res }) => {
  const email = userData.email;

  switch (purpose) {
    case "signup":
      return await handleSignupOtp({ userData, res });

    case "forgot-password":
      return await handleForgotPasswordOtp(email);

    default:
      return { message: "User verified successfully" };
  }
};

// Handle signup otp
const handleSignupOtp = async ({ userData, res }) => {
  const user = await createUser({
    fullname: userData.fullname,
    email: userData.email,
    role: userData.role,
    password: userData.password,
    authProvider: userData.authProvider,
    isVerified: true,
  });

  const accessToken = await sendTokens(res, user);

  const updatedUser = sanitizeUser(user);

  return {
    success: true,
    message: "User verified successfully",
    user: updatedUser,
    accessToken,
  };
};

// Handle forgotpassword otp service
const handleForgotPasswordOtp = async (email) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "USER_NOT_FOUND",
      "User not found"
    );
  }

  return {
    message: "User verified successfully",
  };
};

// Refresh access token
export const refreshAccessToken = async (token) => {
  if (!token) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "TOKEN_MISSING",
      "Missing Refresh Token."
    );
  }

  const payload = await verifyRefreshToken(token);

  if (!payload) {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      "INVALID_TOKEN",
      "Invalid or expired refresh token."
    );
  }

  await revokeRefreshToken(payload.tokenId);

  const user = {
    _id: payload.userId,
    role: payload.role,
  };

  return user;
};

// logout.service.js
export const handleLogout = async (res, tokenName, token) => {
  const refreshToken = res.req.cookies[tokenName];

  // Decode expiry for blacklist
  if (token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    await blacklistToken(token, expiresIn);
  }

  res.clearCookie(tokenName, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  if (!refreshToken) {
    return;
  }

  const payload = await verifyRefreshToken(refreshToken);
  await revokeRefreshToken(payload.tokenId);
};

// Send otp service
export const sendOtp = async (data) => {
  const { email, purpose, oldEmail } = data;
  if (!email || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "email and purpose are required."
    );
  }

  let user = await finduser(email);

  if (!user && !purpose === "edit-email") {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "USER_NOT_FOUND",
      "User not found"
    );
  }

  if (purpose === "edit-email") {
    user = await finduser(oldEmail);
  }

  await generateOtp({ email, userData: user, purpose });

  return email;
};

// Forgot password
export const forgotPassword = async (data) => {
  const { password, email } = data;

  if (!password || !email) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "email and pasword required."
    );
  }

  const user = await finduser(email);
  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "USER_NOT_FOUND",
      "User not found"
    );
  }

  await updatePassword({
    email,
    password,
  });
};
