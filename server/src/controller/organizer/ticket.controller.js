import { verifyTicket } from "../../services/organizer/ticketVerify/ticket.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

export const verifyTicketController = asyncHandler(async (req, res) => {
  const { qrData } = req.body;
  if (!qrData) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }
  const ticket = await verifyTicket(qrData);

  sendResponse(res, ticket, STATUS_CODE.SUCCESS);
});
