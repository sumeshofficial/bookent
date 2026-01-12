import { adminApi } from "../../../../services/api/apiSetup";

export const fetchUsers = async (params) => {
  const { data } = await adminApi.get("/admin/users", { params });
  return data;
};

export const toggleUserStatus = async ({ userId, newStatus }) => {
  const { data } = await adminApi.patch(`/admin/users/${userId}/status`, {
    status: newStatus,
  });
  return data;
};
