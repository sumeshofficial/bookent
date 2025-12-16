import { api } from "../../../../services/api/apiSetup";

export const verifyTicketByQR = async (qrData) => {
  const { data } = await api.post("/organizer/ticket/verify", { qrData });

  return data;
};
