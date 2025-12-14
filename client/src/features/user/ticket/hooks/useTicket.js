import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchTicket } from "../services/ticket.service";

const useTicket = () => {
  const { orderId } = useParams();
  return useQuery({
    queryKey: ["my-ticekt", orderId],
    queryFn: () => fetchTicket(orderId),
    enabled: !!orderId,
  });
};

export default useTicket;
