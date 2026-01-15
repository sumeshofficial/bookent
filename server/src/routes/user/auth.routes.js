import express from "express";
import {
  forgotPasswordController,
  googleAuthController,
  loginwithEmailController,
  logoutUserController,
  refreshAccessTokenController,
  registerUserWithEmailController,
  resendOTPController,
  sendOtpController,
  verifyOtpController,
} from "../../controller/user/auth.controller.js";
import dotenv from "dotenv";
import { googleCallbackMiddleware } from "../../middlewares/user/googleCallbackMiddleware.js";
import { googleInitMiddleware } from "../../middlewares/user/googleInitMiddleware.js";
import rateLimit from "express-rate-limit";

dotenv.config();
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many attempts. Please try again after 15 minutes.",
  },
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/google", googleInitMiddleware);
router.get("/google/callback", googleCallbackMiddleware, googleAuthController);

router.post("/refresh-token", authRateLimiter, refreshAccessTokenController);
router.post("/email/signup", authRateLimiter, registerUserWithEmailController);
router.post("/email/signin", loginLimiter, loginwithEmailController);
router.post("/send-otp", loginLimiter, sendOtpController);
router.post("/resend-otp", loginLimiter, resendOTPController);
router.post("/verify-otp", loginLimiter, verifyOtpController);
router.post("/forgot-password", authRateLimiter, forgotPasswordController);
router.post("/logout", authRateLimiter, logoutUserController);

export default router;
