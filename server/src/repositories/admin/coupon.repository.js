import Coupon from "../../models/coupons.model.js";

export const createCouponRepo = async (payload) => {
  return Coupon.create(payload);
};
