import express from "express";
import { verifyTicketController } from "../../controller/organizer/ticket.controller.js";
const router = express.Router();

router.post("/verify", verifyTicketController);

export default router;
