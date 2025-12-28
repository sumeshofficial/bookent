import { adminApi } from "../../../../services/api/apiSetup";

export const fetchEventBySlug = async (slug) => {
  const { data } = await adminApi.get(`/admin/events/${slug}`);
  return data;
};
