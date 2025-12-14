import { useQuery } from "@tanstack/react-query";
import { fetchBookedTicket } from "../service/ticketBooked.service";

export const useTicketBooked = (orderId) => {
  return useQuery({
    queryKey: ["ticket-booked", orderId],
    queryFn: () => fetchBookedTicket(orderId),
    enabled: !!orderId,
  });
};