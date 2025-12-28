import {
  getCoupon,
  updateCoupon,
} from "../../../../repositories/user/coupon.repository.js";
import { updateCouponUsage } from "../../../../repositories/user/couponUsage.repository.js";
import { makeTicketSold } from "../../../../repositories/user/event.repository.js";
import { updateOrder } from "../../../../repositories/user/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";
import { generateOrderQr } from "./generateQr.helper.js";

export const finalizeWalletOrder = async ({
  order,
  couponCode,
  userId,
  session,
}) => {
  if (couponCode) {
    const coupon = await getCoupon(couponCode, session);
    await updateCoupon(coupon._id, session);
    await updateCouponUsage(coupon._id, userId, session);
  }

  await makeTicketSold(order.eventId, order.seat, session);

  const qrToken = generateOrderQr(order);

  return updateOrder(
    order._id,
    {
      status: ORDER_STATUS.CONFIRMED,
      qrData: { data: qrToken, isUsed: false, usedAt: null },
    },
    session
  );
};
