import express from "express";
import { checkoutDetailsController } from "../../controller/user/checkout.controller.js";

const router = express.Router();

router.post("/verify-lock", checkoutDetailsController);

export default router;
