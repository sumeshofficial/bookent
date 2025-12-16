import { api } from "../../../../services/api/apiSetup";

export const verifyTicketByQR = async ({ qrData, eventId }) => {
  const { data } = await api.post("/organizer/ticket/verify", {
    qrData,
    eventId,
  });

  return data;
};
