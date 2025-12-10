import express from "express";
import {
  capturePaypalOrderController,
  checkoutDetailsController,
  createPaypalOrderController,
} from "../../controller/user/checkout.controller.js";

const router = express.Router();

router.post("/verify-lock", checkoutDetailsController);
router.post("/payment/paypal/create-order", createPaypalOrderController);
router.post("/payment/paypal/capture", capturePaypalOrderController);

export default router;
