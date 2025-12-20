import { createCouponRepo } from "../../../repositories/admin/coupon.repository.js";
import { buildCoupon } from "./helpers/buildCoupon.js";

export const createCoupon = async (payload) => {
  const coupon = await createCouponRepo(payload);

  const updatedCoupon = buildCoupon(coupon);

  return updatedCoupon;
};
