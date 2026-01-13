import express from "express";
import {
  getMyTicketController,
  getMyTicketInvoiceController,
  getMyTicketsController,
} from "../../controller/user/tickets.controller.js";
const router = express.Router();

router.get("/", getMyTicketsController);
router.get("/:orderId", getMyTicketController);
router.get("/:orderId/invoice", getMyTicketInvoiceController);

export default router;
