import { api } from "./api/apiSetup";

// Organizer Registration Form
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

// Check Organizer
export const checkOrganizer = async ({ userId }) => {
  return await api.get(`/organizer/${userId}/dashboard`);
};

// Create Stadium
export const createStadium = async (payload) => {
  return await api.post("/organizer/stadium/create", payload);
};

// Get all Stadiums
export const getStadiums = async () => {
  return await api.get("/organizer/stadiums");
};

// Check Stadium name exists or not
export const checkStadiumExists = async (name) => {
  return await api.get(
    `/organizer/stadium/check-name?name=${encodeURIComponent(name)}`
  );
};

// Creare Event validate
export const createEventValidate = async (data) => {
  const res = await api.post("/organizer/event/create/validate", data);
  return res.data;
};

// Create event finish
export const createEventFinish = async ({
  sessionId,
  bannerImageKey,
  thumbnailImageKey,
}) => {
  const res = await api.post("/organizer/event/create/finish", {
    sessionId,
    bannerImageKey,
    thumbnailImageKey,
  });
  return res.data;
};

// Get events
export const getEvents = async ({
  id,
  page,
  limit,
  search,
  sort,
  status,
  startDate,
  endDate,
  category,
  priceFilter,
}) => {
  const res = await api.get(`/organizer/${id}/events`, {
    params: {
      page,
      limit,
      search,
      sort,
      status,
      startDate,
      endDate,
      category,
      priceFilter,
    },
  });
  return res.data;
};

// Get event
export const getEvent = async (organizerId, eventId) => {
  const res = await api.get(`/organizer/${organizerId}/event/${eventId}`);
  return res.data;
};

// Update event
export const updateEvent = async (eventId, data) => {
  const res = await api.patch(`/organizer/event/${eventId}/edit`, data);
  return res.data;
};

// Edit event finish
export const editEventFinish = async ({ sessionId, images }) => {
  const res = await api.post("/organizer/event/edit/finish", {
    sessionId,
    images,
  });
  return res.data;
};

// Delete event
export const deleteEvent = async (eventId) => {
  await api.patch("/organizer/event/delete", {
    eventId,
  });
};
