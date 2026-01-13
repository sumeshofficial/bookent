import express from "express";
import { applyCouponController } from "../../controller/user/coupon.controller.js";
const router = express.Router();

router.get("/:couponCode/:lockId", applyCouponController);

export default router;
