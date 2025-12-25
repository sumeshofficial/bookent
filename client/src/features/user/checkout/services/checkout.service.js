import { api } from "../../../../services/api/apiSetup";

export const validateCouponApi = async ({ couponCode, lockId }) => {
  const { data } = await api.post("/user/coupons", {
    couponCode,
    lockId,
  });

  return data;
};