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

dotenv.config();
const router = express.Router();

router.get("/google", googleInitMiddleware);
router.get("/google/callback", googleCallbackMiddleware, googleAuthController);

router.post("/refresh-token", refreshAccessTokenController);
router.post("/email/signup", registerUserWithEmailController);
router.post("/email/signin", loginwithEmailController);
router.post("/send-otp", sendOtpController);
router.post("/resend-otp", resendOTPController);
router.post("/verify-otp", verifyOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/logout", logoutUserController);

export default router;
