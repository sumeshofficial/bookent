import { getCoupon } from "../../../repositories/user/coupon.repository.js";
import { ERRORS } from "../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../utility/constants/statusCode.js";
import { AppError } from "../../../utility/helpers.js";
import { discountCalculation } from "./helper/discountCalculation.js";
import { validateCoupon } from "./helper/validateCoupon.js";

/**
 * Apply coupon on already-calculated backend pricing
 * @param {string} couponCode
 * @param {object} pricing
 */
export const applyCouopn = async (couponCode, pricing, userId) => {
  const coupon = await getCoupon(couponCode);

  await validateCoupon(coupon, userId);

  const { ticketPrice, orderAmount, baseFee, gst, bookingFee, grandTotal } =
    pricing;

  if (orderAmount < coupon.minOrderAmount) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.MINIMUM_ORDER_AMOUNT_NOT_MET.CODE,
      `${ERRORS.MINIMUM_ORDER_AMOUNT_NOT_MET.MSG} $${coupon.minOrderAmount}`
    );
  }

  const { discount, finalGrandTotal } = discountCalculation(
    coupon,
    orderAmount,
    grandTotal
  );

  const discountedOrderAmount = orderAmount - discount;

  return {
    ticketPrice,
    baseFee,
    gst,
    bookingFee,
    orderAmount: discountedOrderAmount.toFixed(2),
    discount,
    couponCode: coupon.code,
    grandTotal: finalGrandTotal,
  };
};
