import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchOrderStatus } from "../services/payment.service";

const usePaymentStatus = (orderId, { onSuccess, onFail }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => fetchOrderStatus(orderId),
    enabled: !!orderId,
    refetchInterval: (query) =>
      query.state.data?.status === "success" ||
      query.state.data?.status === "failed"
        ? false
        : 1500,
    retry: 3,
    onError: () => onFail?.({ message: "Network issue. Please try again." }),
  });

  useEffect(() => {
    if (data?.status === "success") {
      onSuccess?.(data);
    }
    if (data?.status === "failed") {
      onFail?.(data);
    }
  }, [data, data?.status, onFail, onSuccess]);

  return {
    status: data?.status || "pending",
    message: data?.message || "Verifying your payment...",
    isLoading,
  };
};

export default usePaymentStatus;
