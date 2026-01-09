import { api } from "../../../../services/api/apiSetup";

export const fetchAdminDashboard = async (filters) => {
  const { data } = await api.get("/organizer/dashboard/stats", {
    params: filters,
  });
  return data;
};
