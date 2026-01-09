import { adminApi } from "../../../../services/api/apiSetup";

export const fetchAdminDashboard = async (filters) => {
  const { data } = await adminApi.get("/admin/dashboard", {
    params: filters,
  });
  return data;
};
