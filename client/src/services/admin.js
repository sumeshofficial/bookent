import adminApi from "./api/adminInterceptor";

export const getAllUsers = async ({
  role,
  page,
  limit,
  search,
  sort,
  status,
}) => {
  try {
    return await adminApi.get(
      `/admin/users?role=${role}&page=${page}&limit=${limit}&search=${search}&sort=${sort}&status=${status}`
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const getAllOrganizers = async ({
  page,
  limit,
  search,
  sort,
  status,
}) => {
  try {
    return await adminApi.get(
      `/admin/organizers?&page=${page}&limit=${limit}&search=${search}&sort=${sort}&status=${status}`
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const toggleUserStatusAPI = async ({ userId, newStatus }) => {
  try {
    const res = await adminApi.patch(`/admin/users/${userId}/${newStatus}`);

    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};
export const rejectOrganizerRequest = async ( id ) => {
  try {
    const res = await adminApi.patch(`/admin/organizers/${id}/reject`);

    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const approveOrganizerRequest = async (id ) => {
  try {
    const res = await adminApi.patch(`/admin/organizers/${id}/approve`);

    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const getUserDeatils = async (userId) => {
  try {
    const user =  await adminApi.get(`/admin/users/${userId}`);
    return user;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const getOrganizerDetails = async (id) => {
  try {
    const organizer =  await adminApi.get(`/admin/organizers/${id}`);
    return organizer;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    throw new Error(message);
  }
};
