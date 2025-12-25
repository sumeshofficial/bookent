import { COUPON_TYPES } from "../../../../utility/constants/constants.js";

/**
 * Coupon discount calculation
 * @param {object} coupon
 * @param {Number} orderAmount
 * @param {Number} grandTotal
 */
export const discountCalculation = (coupon, orderAmount, grandTotal) => {
  let discount = 0;

  if (coupon.discountType === COUPON_TYPES.FLAT) {
    discount = coupon.discountValue;
  }

  if (coupon.discountType === COUPON_TYPES.PERCENTAGE) {
    discount = (orderAmount * coupon.discountValue) / 100;

    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  }

  discount = Math.min(discount, grandTotal);

  const finalGrandTotal = Number((grandTotal - discount).toFixed(2));

  return { discount, finalGrandTotal };
};
