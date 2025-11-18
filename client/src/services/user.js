import { api } from "./api/apiSetup";

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

// Get Home Page Events
export const getEventsForUser = async () => {
  const res = await api.get("/me/home");
  return res.data;
};

// Get Filter And Sort Event
export const getFilterAndSortEvent = async (params) => {
  const res = await api.get("/me/events", { params });
  return res.data;
};

// Search Event
export const searchEvent = async (params) => {
  const res = await api.get("/me/event/search", { params });
  return res.data;
};

// Fetch Event
export const eventById = async (eventId) => {
  const res = await api.get(`/me/event/${eventId}`);
  return res.data;
};
