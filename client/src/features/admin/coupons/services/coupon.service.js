import { adminApi } from "../../../../services/api/apiSetup";

export const fetchCoupons = async (params) => {
  const { data } = await adminApi.get("/admin/coupons", { params });
  return data;
};

export const createCouponService = async (payload) => {
  const { data } = await adminApi.post("/admin/coupons", payload);
  return data;
};

export const updateCoupon = async (couponId, updateData) => {
  const { data } = await adminApi.patch(
    `/admin/coupons/${couponId}`,
    updateData
  );
  return data;
};

export const deleteCoupon = async (couponId) => {
  const { data } = await adminApi.delete(`/admin/coupons/${couponId}`);
  return data;
};
