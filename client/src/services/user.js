import { api } from "./api/axiosSetup";

export const updateProfile = async ({ id, data }) => {
  try {
    return await api.patch(
      "/me",
      {
        id,
        data,
      },
      { withCredentials: true }
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
