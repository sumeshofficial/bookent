import { api } from "./api/axiosSetup";

export const registerOrganizationAccount = async ({
  bankAccountDetails,
  organizationDetails,
  userId
}) => {
  try {
    const res = await api.post(
      "/organizer/account/register",
      {
        bankAccountDetails,
        organizationDetails,
        userId
      },
      { withCredentials: true }
    );

    console.log(res.data);
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
}