import axios from "axios";
import { ENV } from "../config/env";
import { api } from "./api/apiSetup";

// Organizer Registration Form
export const registerOrganizationAccount = async ({
  bankAccountDetails,
  organizationDetails,
  userId,
}) => {
  const res = await api.post(
    "/organizer/auth/register",
    {
      bankAccountDetails,
      organizationDetails,
      userId,
    },
    { withCredentials: true }
  );

  return res.data;
};

// Check Organizer
export const checkOrganizer = async ({ userId }) => {
  return await api.get(`/organizer/${userId}/dashboard`);
};

// Create Stadium
export const createStadium = async ({ payload }) => {
  const res = await api.post("/organizer/stadiums/create", payload);
  return res.data;
};

// Update Stadium
export const updateStadium = async ({ stadiumId, payload }) => {
  const res = await api.patch(`/organizer/stadiums/${stadiumId}`, payload);
  return res.data;
};

// Delete Stadium
export const deleteStadium = async (stadiumId) => {
  return await api.patch(`/organizer/stadiums/${stadiumId}/delete`);
};

// Get all Stadiums
export const getStadiums = async () => {
  return await api.get("/organizer/stadiums");
};

// Get all Stadiums
export const getStadium = async (stadiumSlug) => {
  const res = await api.get(`/organizer/stadiums/${stadiumSlug}`);
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
  const res = await api.get(`/organizer/stadiums/or/${id}`, {
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
    `/organizer/stadiums/check-name?name=${encodeURIComponent(name)}`,
    {
      params: {
        stadiumId,
      },
    }
  );
};

// Creare Event validate
export const createEventValidate = async (data) => {
  const res = await api.post("/organizer/events/create/validate", data);
  return res.data;
};

// Create event finish
export const createEventFinish = async ({
  sessionId,
  bannerImageKey,
  thumbnailImageKey,
}) => {
  const res = await api.post("/organizer/events/create/finish", {
    sessionId,
    bannerImageKey,
    thumbnailImageKey,
  });
  return res.data;
};

// Get events
export const getEvents = async ({
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
  const res = await api.get(`/organizer/events`, {
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
export const getEvent = async (eventSlug) => {
  const res = await api.get(`/organizer/events/${eventSlug}`);
  return res.data;
};

// Update event
export const updateEvent = async (eventSlug, data) => {
  const res = await api.patch(`/organizer/events/${eventSlug}/edit`, data);
  return res.data;
};

// Update event
export const cancelEvent = async (eventSlug, data) => {
  console.log(data)
  const res = await api.patch(`/organizer/events/${eventSlug}/cancel`, data);
  return res.data;
};

// Edit event finish
export const editEventFinish = async ({ sessionId, images }) => {
  const res = await api.post("/organizer/events/edit/finish", {
    sessionId,
    images,
  });
  return res.data;
};

// Delete event
export const deleteEvent = async (eventId) => {
  await api.delete(`/organizer/events/${eventId}`);
};

// Get all Indian States
export const getState = async () => {
  const url = ENV.VITE_STATE_API_URL;
  const response = await axios.get(url, {
    headers: {
      "X-RapidAPI-Key": ENV.VITE_RAPIDAPI_KEY,
      "X-RapidAPI-Host": "country-state-city-search-rest-api.p.rapidapi.com",
    },
  });
  return response.data;
};

// Get all City
export const getCity = async (stateCode) => {
  const url = `${ENV.VITE_CITY_API_URL}${stateCode}`;
  const response = await axios.get(url, {
    headers: {
      "X-RapidAPI-Key": ENV.VITE_RAPIDAPI_KEY,
      "X-RapidAPI-Host": "country-state-city-search-rest-api.p.rapidapi.com",
    },
  });
  return response.data;
};

// Update organizer profile
export const updateOrganizer = async ({ id, data }) => {
  const res = await api.patch("/organizer/account/profile", {
    id,
    data,
  });

  return res;
};

// Send otp for email verification
export const sendOtpEmailVerification = async (email, purpose) => {
  const res = await api.post("/organizer/auth/sendOtp", {
    email,
    purpose,
  });

  return res.data;
};
