import express from "express";
import { applyCouponController } from "../../controller/user/coupon.controller.js";
const router = express.Router();

router.post("/", applyCouponController);

export default router;
