import { api } from "../../../../services/api/apiSetup";

export const validateCouponApi = async ({ couponCode, lockId }) => {
  const { data } = await api.get(`/user/coupons/${couponCode}/${lockId}/`);

  return data;
};