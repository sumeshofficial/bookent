import express from "express";
import passport from "../../middlewares/user/passport.js";
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
import { sendPopupResponse } from "../../utility/user/googleAuth.js";

dotenv.config();

const router = express.Router();

router.get("/google", (req, res, next) => {
  const state = req.query.state;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    const FRONTEND_URL = process.env.FRONTEND_URL;
    if (err) {
      return sendPopupResponse(res, { error: "${err.message}" }, FRONTEND_URL);
    }

    if (!user) {
      return sendPopupResponse(
        res,
        { error: "Authentication failed" },
        FRONTEND_URL
      );
    }

    req.user = user;
    googleAuthController(req, res, next);
  })(req, res, next);
});

router.post("/refresh-token", refreshAccessTokenController);
router.post("/email/signup", registerUserWithEmailController);
router.post("/email/signin", loginwithEmailController);
router.post("/send-otp", sendOtpController);
router.post("/resend-otp", resendOTPController);
router.post("/verify-otp", verifyOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/logout", logoutUserController);

export default router;
