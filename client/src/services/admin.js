import { adminApi } from "./api/apiSetup";

export const getAllOrganizers = async ({
  page,
  limit,
  search,
  sort,
  status,
}) => {
  return await adminApi.get(
    `/admin/organizers?&page=${page}&limit=${limit}&search=${search}&sort=${sort}&status=${status}`
  );
};

export const handleOrganizerRequest = async ({ id, status, reason }) => {
  const body = { status };

  if (status === "rejected") {
    body.reason = reason;
  }

  const res = await adminApi.patch(`/admin/organizers/${id}`, body);

  return res.data;
};

export const getUserDeatils = async (userId) => {
  const user = await adminApi.get(`/admin/users/${userId}`);
  return user;
};

export const getOrganizerDetails = async (id) => {
  const res = await adminApi.get(`/admin/organizers/${id}`);
  return res.data;
};
