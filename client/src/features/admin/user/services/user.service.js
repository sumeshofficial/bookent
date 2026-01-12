import { adminApi } from "../../../../services/api/apiSetup";

export const fetchUserDetails = async (userId) => {
  const { data } = await adminApi.get(`/admin/users/${userId}`);
  return data;
};
