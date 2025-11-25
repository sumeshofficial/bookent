import express from "express";
import {
  organizerAccountRegister,
  sendOtpController,
} from "../../controller/organizer/auth.controller.js";
const router = express.Router();

router.post("/register", organizerAccountRegister);
router.post("/sendOtp", sendOtpController);

export default router;
