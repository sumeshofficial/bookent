import axios from "axios";
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
export const createStadium = async ({ payload }) => {
  const res = await api.post("/organizer/stadium/create", payload);
  return res.data;
};

// Update Stadium
export const updateStadium = async ({ stadiumId, payload }) => {
  const res = await api.patch(`/organizer/stadium/${stadiumId}`, payload);
  return res.data;
};

// Delete Stadium
export const deleteStadium = async (stadiumId) => {
  return await api.patch(`/organizer/stadium/${stadiumId}/delete`);
};

// Get all Stadiums
export const getStadiums = async () => {
  return await api.get("/organizer/stadiums");
};

// Get all Stadiums
export const getStadium = async (stadiumId) => {
  const res = await api.get(`/organizer/stadium/${stadiumId}`);
  return res.data;
};

// Get all Stadiums with Organizer id
export const getStadiumsWithOrganizerId = async ({
  id,
  page,
  limit,
  search,
  sort,
}) => {
  const res = await api.get(`/organizer/${id}/stadiums`, {
    params: {
      page,
      limit,
      search,
      sort,
    },
  });

  return res.data;
};

// Check Stadium name exists or not
export const checkStadiumExists = async (name, stadiumId = "") => {
  return await api.get(
    `/organizer/stadium/check-name?name=${encodeURIComponent(name)}`,
    {
      params: {
        stadiumId,
      },
    }
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

// Get all Indian States
export const getState = async () => {
  const url = import.meta.env.VITE_STATE_API_URL;
  const response = await axios.get(url);
  return response.data;
};

// Get all City
export const getCity = async (stateName) => {
  const url = import.meta.env.VITE_CITY_API_URL;
  const response = await axios.post(
    url,
    {
      country: "India",
      state: stateName,
    },
    { withCredentials: false }
  );
  return response.data;
};

// Update organizer profile
export const updateOrganizer = async ({ id, data }) => {
  const res = await api.patch("/organizer/profile", {
    id,
    data,
  });

  return res;
};
