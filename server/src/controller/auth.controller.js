import dotenv from "dotenv";
import { checkOtp, generateOtp, verifyUser } from "../services/otp.service.js";
import {
  createUser,
  finduser,
  isUserExists,
} from "../services/auth.service.js";
import { sendTokens } from "../utility/sendTokens.js";
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
  const accessToken = await sendTokens(res, user);

  return res.send(`
    <script>
      window.opener.postMessage(
        ${JSON.stringify({ accessToken, user })},
        "http://localhost:5173"
      );
      window.close();
    </script>
  `);
};

// User signup with email controoler
export const registerUserWithEmail = async (req, res) => {
  const { fullname, email, password, purpose } = req.body;
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

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
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

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otpDoc = await checkOtp(user._id);
    if (!otpDoc || otpDoc.otp !== otp || otpDoc.purpose !== purpose)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const verifiedUser = await verifyUser(user, purpose);

    const accessToken = await sendTokens(res, user);

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      user: verifiedUser,
      accessToken,
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
