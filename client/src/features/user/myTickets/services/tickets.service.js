import { api } from "../../../../services/api/apiSetup";

export const fetchMyTickets = async (params) => {
  const { data } = await api.get("/user/tickets/", { params });
  return data;
};
