import axios from "axios";
import { adminApi } from "../../../../services/api/apiSetup";

export const fetchAdminBanners = async (params) => {
  const { data } = await adminApi.get("/admin/banners", { params });
  return data;
};

export const createBanner = async (payload) => {
  const { data } = await adminApi.post("/admin/banners", payload);
  return data;
};

export const updateBanner = async (payload) => {
  const { data } = await adminApi.patch(`/admin/banners/${payload.id}`, payload);
  return data;
};

export const deleteBanner = async (bannerId) => {
  const { data } = await adminApi.delete(`/admin/banners/${bannerId}`);
  return data;
};

export const uploadImages = async (url, file) => {
  await axios.put(url, file);
};
