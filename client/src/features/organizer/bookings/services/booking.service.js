import { api } from "../../../../services/api/apiSetup";

export const fetchEventBookings = async (eventSlug, filters) => {
  const { data } = await api.get(`/organizer/events/${eventSlug}/bookings`, { params: filters });

  return data;
};
