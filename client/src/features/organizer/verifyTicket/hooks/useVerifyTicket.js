import { useMutation } from "@tanstack/react-query";
import { verifyTicketByQR } from "../services/ticketVerify.service";

export const useVerifyTicket = () => {
  return useMutation({
    mutationFn: verifyTicketByQR,
  });
};
