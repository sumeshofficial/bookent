import express from "express";
import {
  googleAuth,
  registerUserWithEmail,
  resendOTP,
  verifyOtp,
  logoutUser,
  loginwithEmail,
  refreshAccessToken,
  getUser,
  sendOtp,
  forgotPassword
} from "../controller/auth.controller.js";
import passport from "../middlewares/passport.js";
import { protect } from "../middlewares/auth.middleware.js";
const authRouter = express.Router();

// Google login
authRouter.get("/google", (req, res, next) => {
  const state = req.query.state;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
  })(req, res, next);
});
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  googleAuth
);
authRouter.get('/getUser', protect, getUser);


authRouter.post('/refresh-token', refreshAccessToken);
authRouter.post("/email/signup", registerUserWithEmail);
authRouter.post("/email/signin", loginwithEmail);
authRouter.post("/send-otp", sendOtp);
authRouter.post("/resend-otp", resendOTP);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/logout", logoutUser);

export default authRouter;
