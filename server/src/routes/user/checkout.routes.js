import express from "express";
import {
  capturePaypalOrderController,
  checkoutDetailsController,
  createOrderWithWallet,
  createPaypalOrderController,
  getOrderStatusController,
  getTicketController,
} from "../../controller/user/checkout.controller.js";

const router = express.Router();

router.get("/order-status/:orderId", getOrderStatusController);
router.get("/:orderId/ticket", getTicketController);

router.post("/verify-lock", checkoutDetailsController);
router.post("/payment/paypal/create-order", createPaypalOrderController);
router.post("/payment/paypal/capture", capturePaypalOrderController);
router.post("/payment/wallet", createOrderWithWallet);

export default router;
