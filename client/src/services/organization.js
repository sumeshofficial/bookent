import { api } from "./api/axiosSetup";

export const registerOrganizationAccount = async ({
  bankAccountDetails,
  organizationDetails,
  userId,
}) => {
  try {
    const res = await api.post(
      "/organizer/account/register",
      {
        bankAccountDetails,
        organizationDetails,
        userId,
      },
      { withCredentials: true }
    );

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

export const checkOrganizer = async ({ userId }) => {
  return await api.get(`/organizer/${userId}/dashboard`);
};

export const createStadium = async (payload) => {
  return await api.post("/organizer/create-stadium", payload);
};

export const getStadiums = async () => {
  return await api.get('/organizer/stadiums');
}

export const checkStadiumExists = async (name) => {
  return await api.get(`/organizer/stadium/check-name?name=${encodeURIComponent(name)}`);
}