import {
  ERRORS,
  ORDER_STATUS,
} from "../../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { AppError } from "../../../../utility/helpers.js";

export const validateOrderAndTicket = (order) => {
  if (!order) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.ORDER_NOTFOUND.CODE,
      ERRORS.ORDER_NOTFOUND.MSG
    );
  }

  if (order.status !== ORDER_STATUS.CONFIRMED) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.ORDER_NOT_CONFIRMED.CODE,
      ERRORS.ORDER_NOT_CONFIRMED.MSG
    );
  }

  if (order.qrData?.isUsed) {
    throw new AppError(
      STATUS_CODE.CONFLICT,
      ERRORS.TICKET_ALREADY_USED.CODE,
      ERRORS.TICKET_ALREADY_USED.MSG
    );
  }
};
