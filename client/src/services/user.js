import { api } from "./api/apiSetup";

export const updateProfile = async ({ id, data }) => {
  return await api.patch(
    "/user/account",
    {
      id,
      data,
    },
    { withCredentials: true }
  );
};

// Get Home Page Events
export const getEventsForUser = async () => {
  const res = await api.get("/user/events/home");
  return res.data;
};

// Get Filter And Sort Event
export const getFilterAndSortEvent = async (params) => {
  const res = await api.get("/user/events/", { params });
  return res.data;
};

// Search Event
export const searchEvent = async (params) => {
  const res = await api.get("/user/events/search", { params });
  return res.data;
};

// Fetch Event
export const eventBySlug = async (eventSlug) => {
  const res = await api.get(`/user/events/${eventSlug}`);
  return res.data;
};

// Checkout verify lock
export const verifySeatLock = async (lockId, appliedCoupon) => {
  const res = await api.post("/user/checkout/verify-lock", {
    lockId,
    appliedCoupon
  });

  return res.data;
};
