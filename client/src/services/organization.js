import { api } from "./api/apiSetup";

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
  return await api.post("/organizer/stadium/create", payload);
};

export const getStadiums = async () => {
  return await api.get("/organizer/stadiums");
};

export const checkStadiumExists = async (name) => {
  return await api.get(
    `/organizer/stadium/check-name?name=${encodeURIComponent(name)}`
  );
};

export const createEventValidate = async (data) => {
  const res = await api.post("/organizer/event/create/validate", data);
  return res.data;
};

export const createEventFinish = async ({
  sessionId,
  bannerImage,
  thumbnailImage,
}) => {
  const res = await api.post("/organizer/event/create/finish", {
    sessionId,
    bannerImage,
    thumbnailImage,
  });
  return res.data;
};

export const getEvents = async (id) => {
  const res = await api.get(`/organizer/${id}/events`);
  return res.data;
};
