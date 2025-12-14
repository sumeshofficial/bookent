import { api } from "../../../../services/api/apiSetup";

export const fetchTicket = async (orderId) => {
  const { data } = await api.get(`/user/tickets/${orderId}`);
  return data;
};

export const getInvoicePdf = async (orderId) => {
  const res = await api.get(`/user/tickets/${orderId}/invoice`, {
    responseType: "blob",
  });

  return res.data;
};
