import {
  getInvoicePdf,
  getTicketForOrderId,
  getTickets,
} from "../../services/user/tickets.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

export const getMyTicketsController = asyncHandler(async (req, res) => {
  const user = req.user;

  const { updatedOrders, meta } = await getTickets(user._id, req.query);

  sendResponse(res, { updatedOrders, meta }, STATUS_CODE.SUCCESS);
});

export const getMyTicketController = asyncHandler(async (req, res) => {
  const user = req.user;
  const orderId = req.params.orderId;

  const ticket = await getTicketForOrderId(orderId, user);

  sendResponse(res, ticket, STATUS_CODE.SUCCESS);
});

export const getMyTicketInvoiceController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const user = req.user;

  const pdf = await getInvoicePdf(orderId, user);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${orderId}.pdf`
  );

  res.end(pdf);
});
