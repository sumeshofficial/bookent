import { verifyUserTicket } from "../../../repositories/organizer/order.repository.js";
import { getOrder } from "../../../repositories/user/order.repository.js";
import { findUserById } from "../../../repositories/user/user.repository.js";
import { ERRORS, ORDER_STATUS } from "../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../utility/constants/statusCode.js";
import { AppError } from "../../../utility/helpers.js";
import { verifyJWT } from "./helper/verifyJWT.js";

export const verifyTicket = async (qrData) => {
  const { orderId, eventId, userId } = await verifyJWT(qrData);

  const order = await getOrder(orderId, userId);
  const user = await findUserById(userId);

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

  const updatedOrder = await verifyUserTicket(orderId, userId)

  return {
    eventTitle: updatedOrder.eventDetails?.title,
    seatInfo: updatedOrder.seat.qty,
    userName: user.fullname,
  };
};
