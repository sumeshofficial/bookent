import dotenv from "dotenv";
import { checkOtp, delOtp, generateOtp } from "../services/otp.service.js";
import {
  createUser,
  finduser,
  findUserByEmail,
  handleLogout,
  isUserExists,
  updatePassword,
} from "../services/auth.service.js";
import { sendTokens } from "../utility/sendTokens.js";
import {
  revokeRefreshToken,
  verifyRefreshToken,
} from "../services/token.service.js";
import { reverseGeocoding } from "../services/user.service.js";
import { statusCode } from "../utility/constants.js";
import logger from "../config/logger.js";
dotenv.config();

// Google Authentication controller
export const googleAuth = async (req, res) => {
  const user = req.user;
  const FRONTEND_URL = process.env.FRONTEND_URL;

  logger.http(`${req.method} ${req.originalUrl}`);

  try {
    if (!user) {
      logger.warn("Google OAuth callback received with no user in req.user");
      return res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { error: "User not found" },
              "${FRONTEND_URL}"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
    }

    if (user.status === "blocked") {
      logger.warn(`Blocked user attempted Google login: ID=${user._id}`);
      return res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { error: "You are blocked by the admin" },
              "${FRONTEND_URL}"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
    }

    logger.info(`Generating access & refresh tokens for userId=${user._id}`);
    const accessToken = await sendTokens(res, user);

    if (!accessToken) {
      logger.error(`Token generation failed for userId=${user._id}`);
      return res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage(
                { error: "Token generation failed" },
                "${FRONTEND_URL}"
              );
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    logger.info(`Google OAuth successful: ID=${user._id}, role=${user.role}`);

    if (user.role === "user" && user.location) {
      logger.info(
        `Performing reverse geocoding for coordinates (${user.location.latitude}, ${user.location.longitude})`
      );
      const response = await reverseGeocoding({
        lat: user.location.latitude,
        lng: user.location.longitude,
      });

      user.location = {
        ...user.location,
        address: response,
      };
    }

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      location: user.location,
    };

    return res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage(
            { accessToken: "${accessToken}", user: ${JSON.stringify(safeUser)} },
            "${FRONTEND_URL}"
          );
          window.close();
        </script>
      </body>
    </html>
  `);
  } catch (error) {
    logger.error(`Error during Google OAuth: ${error.stack || error.message}`);
    return res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { error: "Authentication failed. Please try again." },
              "${FRONTEND_URL}"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  }
};

// User signup with email controoler
export const registerUserWithEmail = async (req, res) => {
  const { fullname, email, password, purpose, role = "user" } = req.body;

  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!fullname || !email || !password || !purpose) {
      logger.warn(
        `Missing required fields: fullname=${fullname}, email=${email}, purpose=${purpose}`
      );
      return res
        .status(statusCode.missingField)
        .json({ message: "All fields are required" });
    }

    logger.info(`Check email already exists, email=${email}`);
    if (await isUserExists(email)) {
      logger.warn(`User enterd email is already exists, email=${email}`);
      return res
        .status(statusCode.conflict)
        .json({ error: "Email already exists" });
    }

    const userData = { fullname, email, password, role, authProvider: "email" };

    logger.info(
      `Generate OTP for email=${userData.email}, role=${userData.role}`
    );
    await generateOtp({ email, userData, purpose });

    logger.info(`OTP sent succssfully to email=${email}`);
    res.status(statusCode.created).json({
      success: true,
      message: `OTP sent successfully to ${email}`,
    });
  } catch (error) {
    logger.error(`Error Registering User: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({ error: "Something went wrong" });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  const { email, purpose } = req.body;
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!email || !purpose) {
      logger.info(
        `Missing required fields: email=${email}, purpose=${purpose}`
      );
      return res
        .status(statusCode.missingField)
        .json({ message: "email and purpose are required" });
    }

    logger.info(`Check user details for email=${email}, purpose=${purpose}`);
    const userData = await checkOtp(email, purpose);

    if (!userData) {
      logger.warn(
        `No pending OTP found for user email=${email}, purpose=${purpose}`
      );
      return res
        .status(statusCode.notFound)
        .json({ message: "No pending OTP found for user" });
    }

    logger.info(`Regenerate OTP for email=${email}, purpose=${purpose}`);
    await generateOtp({ email, userData, purpose });

    logger.info(
      `OTP Resent successfully to email=${email}, purpose=${purpose}`
    );
    res.status(statusCode.created).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    logger.error(`Error resent OTP: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({ error: "Something went wrong" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp, purpose } = req.body;

  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!email || !otp || !purpose) {
      logger.warn(`Missing required fields email=${email}, purpose=${purpose}`);
      return res
        .status(statusCode.missingField)
        .json({ message: "email, purpose and otp are required" });
    }

    logger.info(`Check OTP valid for email=${email}, purpose=${purpose}`);
    const userData = await checkOtp(email, purpose);

    if (!userData) {
      logger.warn(`No OTP found for user email=${email}, purpose=${purpose}`);
      return res
        .status(statusCode.notFound)
        .json({ message: "OTP expired or not found" });
    }

    if (userData.otp !== otp || userData.purpose !== purpose) {
      logger.warn(`Invalid OTP entry for email=${email} purpose=${purpose}`);
      return res.status(statusCode.badRequest).json({ message: "Invalid OTP" });
    }

    logger.info(`Delete OTP for email=${email}, purpose=${purpose}`);
    await delOtp(email, purpose);

    if (purpose === "signup") {
      logger.info(`Create user for email=${email}`);
      const user = await createUser({
        fullname: userData.fullname,
        email: userData.email,
        role: userData.role,
        password: userData.password,
        authProvider: userData.authProvider,
        isVerified: true,
      });

      logger.info(
        `Send Access Token and Refresh Token for userId=${user._id}, email=${user.email}`
      );
      const accessToken = await sendTokens(res, user);

      logger.info(
        `User verified succssfull, userId=${user._id}, email=${user.email} purpose=${purpose}`
      );
      return res.status(statusCode.success).json({
        success: true,
        message: "User verified successfully",
        user,
        accessToken,
      });
    }

    if (purpose === "forgot-password") {
      logger.info(`Find user by email=${email} for forgot password`);
      const user = await findUserByEmail(email);
      if (!user) {
        logger.warn(`User not found for email=${email}`);
        return res
          .status(statusCode.notFound)
          .json({ message: "User not found" });
      }

      logger.info(
        `User verified succssfull, userId=${user._id}, email=${user.email}, purpose=${purpose}`
      );
      return res.status(statusCode.success).json({
        success: true,
        user,
        message: "User verified successfully",
      });
    }

    logger.info(
      `Email verified succssfull, email=${email}, purpose=${purpose}`
    );
    return res.status(statusCode.success).json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    logger.error(`Error verifing user: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({ error: "Something went wrong" });
  }
};

// Generate RefreshAccessToken
export const refreshAccessToken = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    const token = req.cookies.user_refreshToken;
    if (!token) {
      logger.warn(`Missing refresh token for user`);
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Missing Refresh Token",
      });
    }

    logger.info("Verifing refresh roken");
    const payload = await verifyRefreshToken(token);

    if (!payload) {
      logger.warn("Invalid or expired refresh token for user");
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
      error: "Something went wrong",
    });
  }
};

// Generate RefreshAccessToken for admin
export const refreshAccessTokenForAdmin = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

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

// Logout controller
export const logoutUser = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    logger.info(`Logout User`);
    await handleLogout(res, "user_refreshToken");

    logger.info(`User logged out successfully`);
    res.status(statusCode.success).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    logger.error(`Error logout user: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Something went wrong" });
  }
};

// Admin logout
export const logoutAdmin = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    logger.info(`Logout Admin`);
    await handleLogout(res, "admin_refreshToken");

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

// Login with email
export const loginwithEmail = async (req, res) => {
  const { email, password, purpose } = req.body;
  try {
    if (!email || !password || !purpose) {
      return res.status(statusCode.missingField).json({
        success: false,
        error: "email, purpose and password required",
      });
    }

    const user = await finduser(email);

    if (!user) {
      return res
        .status(statusCode.notFound)
        .json({ success: false, error: "User not found" });
    }

    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
      return res
        .status(statusCode.unAuthorized)
        .json({ success: false, error: "Invalid credentials" });
    }

    if (user.status === "blocked") {
      return res.status(statusCode.unAuthorized).json({
        success: false,
        error: "You are blocked by the admin",
      });
    }

    const accessToken = await sendTokens(res, user);

    res.status(statusCode.success).json({
      success: true,
      isVerified: true,
      user,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (error) {
    return res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message || "Somthing went wrong" });
  }
};

// Get user
export const getUser = async (req, res) => {
  const { user } = req;

  try {
    logger.http(`GET /api/auth/getUser`, { userId: user?._id });

    if (!user) {
      logger.warn("No user found in request context");
      return res.status(statusCode.notFound).json({ error: "User not found" });
    }

    logger.info(`Validating user role: ${user.role}`);

    if (user.role === "user" && user.location) {
      logger.info(
        `Performing reverse geocoding for coordinates (${user.location.latitude}, ${user.location.longitude})`
      );
      const response = await reverseGeocoding({
        lat: user.location.latitude,
        lng: user.location.longitude,
      });

      user.location = {
        ...user.location,
        address: response,
      };
    }

    logger.info(
      `User fetched successfully — ID: ${user._id}, Role: ${user.role}, Email: ${user.email}`
    );
    return res.status(statusCode.success).json({
      success: true,
      message: "User fetch succssfully",
      user: req.user,
    });
  } catch (error) {
    logger.error(`Error fetching user: ${error.stack || error.message}`);
    return res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message || "Somthing went wrong" });
  }
};

// Send OTP
export const sendOtp = async (req, res) => {
  const { email, purpose } = req.body;
  try {
    if (!email || !purpose) {
      return res.status(statusCode.missingField).json({
        success: false,
        error: "email and purpose required",
      });
    }

    const user = await finduser(email);

    if (!user) {
      return res
        .status(statusCode.notFound)
        .json({ success: false, error: "User not found" });
    }

    await generateOtp({ email, userData: user, purpose });

    return res.status(statusCode.created).json({
      success: true,
      isVerified: false,
      message: `OTP sent successfully to ${email}`,
    });
  } catch (error) {
    return res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message || "Somthing went wrong" });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { password, email } = req.body;
  try {
    if (!password || !email) {
      return res
        .status(statusCode.missingField)
        .json({ success: false, message: "email and pasword required" });
    }

    const user = await finduser(email);
    if (!user) {
      return res
        .status(statusCode.notFound)
        .json({ success: false, error: "User not found" });
    }

    await updatePassword({
      email,
      password,
    });

    res.status(statusCode.success).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message || "Somthing went wrong" });
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
