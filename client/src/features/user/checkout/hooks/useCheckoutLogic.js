import { useQuery, useQueryClient } from "@tanstack/react-query";
import { verifySeatLock } from "../../../../services/user.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

export const useCheckoutLogic = () => {
  const lockId = sessionStorage.getItem("lockId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [couponPricing, setCouponPricing] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["ticket", lockId],
    queryFn: () => verifySeatLock(lockId),
    enabled: !!lockId,
  });

  const basePricing = data?.pricing ?? null;

  const pricing = useMemo(() => {
    return couponPricing || basePricing;
  }, [couponPricing, basePricing]);

  useEffect(() => {
    if (error) {
      sessionStorage.removeItem("lockId");
      sessionStorage.removeItem("appliedCoupon");
      toast.error(error.message || "Session expired");
      navigate("/session-expired");
    }
  }, [error, navigate]);

  const recheckLock = async () => {
    const result = await queryClient.fetchQuery({
      queryKey: ["ticket", lockId],
      queryFn: () => verifySeatLock(lockId),
    });

    return result?.isValid;
  };

  const event = data?.event;
  const section = data?.section;

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
    discount: pricing?.discount?.toFixed(2),
  };

  /**
   * Called after coupon is successfully applied
   * @param {object} updatedPricing - backend calculated pricing
   */
  const onCouponApplied = (updatedPricing) => {
    setCouponPricing(updatedPricing);
  };

  const onCouponRemoved = () => {
    setCouponPricing(null);
  };

  return {
    tickets,
    fees,
    grandTotal: pricing?.grandTotal,
    isLoading,
    recheckLock,
    onCouponApplied,
    onCouponRemoved,
  };
};
