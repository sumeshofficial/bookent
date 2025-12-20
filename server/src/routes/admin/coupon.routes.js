import express from "express";
import { createCouponController } from "../../controller/admin/counpon.controller.js";
import { validate } from "../../middlewares/common/validate.middleware.js";
import { createCouponSchema } from "../../../validation/coupon.validation.js";
const router = express.Router();

router.post("/", validate(createCouponSchema), createCouponController);

export default router;
