import { adminApi } from "../../../../services/api/apiSetup";

export const fetchAdminBanners = async (params) => {
  const { data } = await adminApi.get("/admin/banners", { params });
  return data;
};

export const createBanner = async (payload) => {
  const { data } = await adminApi.post("/admin/banners", payload);
  return data;
};

export const updateBanner = async (bannerId, payload) => {
  const { data } = await adminApi.patch(`/admin/banners/${bannerId}`, payload);
  return data;
};

export const deleteBanner = async (bannerId) => {
  const { data } = await adminApi.delete(`/admin/banners/${bannerId}`);
  return data;
};