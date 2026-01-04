import express from "express";
import {
  createCouponController,
  deleteCouponController,
  getCouponsController,
  updateCouponController,
} from "../../controller/admin/counpon.controller.js";
import { validate } from "../../middlewares/common/validate.middleware.js";
import { createCouponSchema } from "../../validation/coupon.validation.js";
const router = express.Router();

router.get("/", getCouponsController);
router.post("/", validate(createCouponSchema), createCouponController);
router.patch("/:couponId", updateCouponController);
router.delete("/:couponId", deleteCouponController);

export default router;
