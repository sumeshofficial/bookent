import { useQuery } from "@tanstack/react-query";
import { verifySeatLock } from "../../../../services/user.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const usePaymentLogic = (eventSlug) => {
  const lockId = sessionStorage.getItem("lockId");
  const appliedCoupon = sessionStorage.getItem("appliedCoupon");
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["ticket", lockId, appliedCoupon],
    queryFn: () => verifySeatLock(lockId, appliedCoupon),
    enabled: !!lockId,
  });

  if (error) {
    sessionStorage.removeItem("lockId");
    sessionStorage.removeItem("appliedCoupon");
    toast.error(error.message || "Something went wrong");
    navigate("/session-expired");
  }

  const event = data?.event;
  const section = data?.section;
  const pricing = data?.pricing;

  if (!isLoading && eventSlug !== event?.slug) {
    return navigate("/error");
  }

  const tickets = {
    title: event?.title,
    count: section?.qty,
    venue: event?.venue,
    date: event?.date,
    time: event?.time,
    section: section?.name?.toUpperCase(),
  };

  const fees = {
    orderAmount: pricing?.orderAmount,
    baseFee: pricing?.baseFee,
    gst: pricing?.gst,
    bookingFee: pricing?.bookingFee,
  };

  return {
    tickets,
    fees,
    grandTotal: pricing?.grandTotal,
    isLoading,
  };
};
