import dotenv from "dotenv";
import { checkOtp, generateOtp, verifyUser } from "../services/otp.service.js";
import {
  createUser,
  finduser,
  isUserExists,
  updatePassword,
} from "../services/auth.service.js";
import { sendTokens, sendTokensForAdmin } from "../utility/sendTokens.js";
import {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../services/token.service.js";
dotenv.config();

// Google Authentication controller
export const googleAuth = async (req, res) => {
  const user = req.user;
  const FRONTEND_URL = process.env.FRONTEND_URL;

  // Blocked user check
  if (user && user.status === "blocked") {
    return res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { error: "Unable to log in" },
              "${FRONTEND_URL}"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  }

  // Generate tokens
  const accessToken = await sendTokens(res, user);

  // Send user + token back to frontend popup
  return res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage(
            { accessToken: "${accessToken}", user: ${JSON.stringify(user)} },
            "${FRONTEND_URL}"
          );
          window.close();
        </script>
      </body>
    </html>
  `);
};

// User signup with email controoler
export const registerUserWithEmail = async (req, res) => {
  const { fullname, email, password, purpose, role = "user" } = req.body;
  try {
    if (!fullname || !email || !password || !purpose) {
      return res
        .status(422)
        .json({ message: "name, email, purpose and password are required" });
    }

    if (await isUserExists(email)) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const user = await createUser({
      fullname,
      email,
      role,
      password,
      authProvider: "email",
    });

    await generateOtp(user, purpose);
    res.status(201).json({
      success: true,
      message: `OTP sent successfully to ${email}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  const { email, purpose } = req.body;
  try {
    if (!email || !purpose) {
      return res
        .status(422)
        .json({ message: "email and purpose are required" });
    }

    const user = await finduser(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await generateOtp(user, purpose);
    res.status(201).json({
      success: true,
      message: `OTP resend successfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp, purpose } = req.body;
  try {
    if (!email || !otp || !purpose)
      return res
        .status(422)
        .json({ message: "email, purpose and otp are required" });

    const user = await finduser(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified && purpose === ("signup" || "signin"))
      return res.status(400).json({ message: "User already verified" });

    const otpDoc = await checkOtp(user._id);
    if (!otpDoc || otpDoc.otp !== otp || otpDoc.purpose !== purpose)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const verifiedUser = await verifyUser(user, purpose);
    if (purpose === ("signup" || "signin")) {
      const accessToken = await sendTokens(res, user);

      return res.status(200).json({
        success: true,
        message: "User verified successfully",
        user: verifiedUser,
        accessToken,
      });
    }

    res.status(200).json({
      success: true,
      user,
      message: "User verified successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Generate RefreshAccessToken
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error("No refresh token");

    const payload = await verifyRefreshToken(token);

    await revokeRefreshToken(payload.tokenId);

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });
    const newRefreshToken = await generateRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// Generate RefreshAccessToken for admin
export const refreshAccessTokenForAdmin = async (req, res) => {
  try {
    const token = req.cookies.admin_refreshToken;
    if (!token) throw new Error("No refresh token");

    const payload = await verifyRefreshToken(token);

    await revokeRefreshToken(payload.tokenId);

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });
    const newRefreshToken = await generateRefreshToken({
      userId: payload.userId,
      role: payload.role,
    });

    res.cookie("admin_refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// Logout controller
export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    if (!refreshToken) {
      return res
        .status(200)
        .json({ success: true, message: "Already logged out" });
    }

    const payload = await verifyRefreshToken(refreshToken);

    await revokeRefreshToken(payload.tokenId);

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Admin logout
export const logoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.admin_refreshToken;

    res.clearCookie("admin_refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    if (!refreshToken) {
      return res
        .status(200)
        .json({ success: true, message: "Already logged out" });
    }

    const payload = await verifyRefreshToken(refreshToken);

    await revokeRefreshToken(payload.tokenId);

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Login with email
export const loginwithEmail = async (req, res) => {
  const { email, password, purpose } = req.body;
  try {
    if (!email || !password || !purpose) {
      return res.status(422).json({
        success: false,
        error: "email, purpose and password required",
      });
    }

    const user = await finduser(email);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    if (user.status === 'blocked') {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      await generateOtp(user, purpose);

      return res.status(200).json({
        success: true,
        isVerified: false,
        message: `OTP sent successfully to ${email}`,
      });
    }

    const accessToken = await sendTokens(res, user);

    res.status(200).json({
      success: true,
      isVerified: true,
      user,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Somthing went wrong" });
  }
};

export const getUser = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "User found", user: req.user });
};

// Send OTP
export const sendOtp = async (req, res) => {
  const { email, purpose } = req.body;
  try {
    if (!email || !purpose) {
      return res.status(422).json({
        success: false,
        error: "email and purpose required",
      });
    }

    const user = await finduser(email);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await generateOtp(user, purpose);

    return res.status(200).json({
      success: true,
      isVerified: false,
      message: `OTP sent successfully to ${email}`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Somthing went wrong" });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { password, email } = req.body;
  try {
    if (!password || !email) {
      return res
        .status(422)
        .json({ success: false, message: "email and pasword required" });
    }

    const user = await finduser(email);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    await updatePassword({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Somthing went wrong" });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, message: "Missing fields" });
    }

    const user = await finduser(email);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Not an admin." });
    }

    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = await sendTokensForAdmin(res, user);

    return res.status(200).json({
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
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
