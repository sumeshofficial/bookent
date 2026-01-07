import express from "express";
import { paypalWebhookController } from "../controller/user/webhook.controller.js";

const router = express.Router();

router.post("/webhook", express.json({ type: "*/*" }), paypalWebhookController);

export default router;
