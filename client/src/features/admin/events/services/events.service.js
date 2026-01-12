import { adminApi } from "../../../../services/api/apiSetup";

export const fetchAdminEvents = async (params) => {
  const { data } = await adminApi.get("/admin/events", {
    params,
  });

  return data;
};
