import {
  createUser,
  finduser,
  findUserByEmail,
  isUserExists,
  updatePassword,
} from "../../repositories/user/user.repository.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
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
import { ERRORS, RES_MESSAGES } from "../../utility/constants/constants.js";

// Signup user service
export const signupUser = async (data) => {
  const { fullname, email, password, purpose, role = "user" } = data;

  if (!fullname || !email || !password || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  if (await isUserExists(email)) {
    throw new AppError(
      STATUS_CODE.CONFLICT,
      ERRORS.EMAIL_ALREADY_EXISTS.CODE,
      ERRORS.EMAIL_ALREADY_EXISTS.MSG
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
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const user = await finduser(email);

  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.USER_NOT_FOUND.CODE,
      ERRORS.USER_NOT_FOUND.MSG
    );
  }

  const isPasswordValid = await user.isValidPassword(password);

  if (!isPasswordValid) {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      ERRORS.INVALID_CREDENTIALS.CODE,
      ERRORS.INVALID_CREDENTIALS.MSG
    );
  }

  if (user.status === "blocked") {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      ERRORS.USER_BLOCKED.CODE,
      ERRORS.USER_BLOCKED.MSG
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
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const userData = await checkOtp(email, purpose);

  if (!userData) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.NO_PENDING_OTP.CODE,
      ERRORS.NO_PENDING_OTP.MSG
    );
  }

  await generateOtp({ email, userData, purpose });
};

// Validate otp sevice
export const validateOtpRequest = ({ email, otp, purpose }) => {
  if (!email || !otp || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }
};

// Verify otp service
export const verifyOtp = async ({ email, otp, purpose }) => {
  const userData = await checkOtp(email, purpose);

  if (!userData) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.OTP_EXPIRED.CODE,
      ERRORS.OTP_EXPIRED.MSG
    );
  }

  if (userData.otp !== otp || userData.purpose !== purpose) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.OTP_INVALID.CODE,
      ERRORS.OTP_INVALID.MSG
    );
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
      return { message: RES_MESSAGES.USER_VERIFIED };
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
    message: RES_MESSAGES.USER_VERIFIED,
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
      ERRORS.USER_NOT_FOUND.CODE,
      ERRORS.USER_NOT_FOUND.MSG
    );
  }

  return {
    message: RES_MESSAGES.USER_VERIFIED,
  };
};

// Refresh access token
export const refreshAccessToken = async (token) => {
  if (!token) {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      ERRORS.TOKEN_MISSING.CODE,
      ERRORS.TOKEN_MISSING.MSG
    );
  }

  const payload = await verifyRefreshToken(token);

  if (!payload) {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      ERRORS.AUTHENTICATION_FAILED.CODE,
      ERRORS.AUTHENTICATION_FAILED.MSG
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

  res.clearCookie(tokenName, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  if (token && token !== "null" && token !== "undefined") {
    const decoded = jwt.decode(token);
    if (decoded?.exp) {
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      await blacklistToken(token, expiresIn);
    }
  }

  if (!refreshToken) {
    return;
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (payload?.tokenId) {
    await revokeRefreshToken(payload.tokenId);
  }
};

// Send otp service
export const sendOtp = async (data) => {
  const { email, purpose, oldEmail } = data;
  if (!email || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  let user = await finduser(email);

  if (!user && !purpose === "edit-email") {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.USER_NOT_FOUND.CODE,
      ERRORS.USER_NOT_FOUND.MSG
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
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const user = await finduser(email);
  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.USER_NOT_FOUND.CODE,
      ERRORS.USER_NOT_FOUND.MSG
    );
  }

  await updatePassword({
    email,
    password,
  });
};
