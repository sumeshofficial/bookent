import { api } from "../../../../services/api/apiSetup";

export const fetchBookedTicket = async (orderId) => {
  const { data } = await api.get(`/user/checkout/${orderId}/ticket`);
  return data;
};
