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

export const getEventsForUser = async () => {
  const res = await api.get("/user/events/home");
  return res.data;
};

export const getFilterAndSortEvent = async (params) => {
  const res = await api.get("/user/events/", { params });
  return res.data;
};

export const searchEvent = async (params) => {
  const res = await api.get("/user/events/search", { params });
  return res.data;
};

export const eventBySlug = async (eventSlug) => {
  const res = await api.get(`/user/events/${eventSlug}`);
  return res.data;
};

export const verifySeatLock = async (lockId, appliedCoupon) => {
  const res = await api.post("/user/checkout/verify-lock", {
    lockId,
    appliedCoupon,
  });

  return res.data;
};

export const getActiveBanners = async () => {
  const { data } = await api.get("/user/banners");
  return data;
};
