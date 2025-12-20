import { DUMMY_COUPONS } from "../constants/coupon.constants";
import { adminApi } from "../../../../services/api/apiSetup";

export const fetchCoupons = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_COUPONS), 500);
  });
};

export const createCouponService = async (payload) => {
  const { data } = await adminApi.post("/admin/coupons", payload);
  return data;
};
