import { useQuery } from "@tanstack/react-query";
import { validateCouponApi } from "../services/checkout.service";

export const useCoupon = (couponCode, lockId) => {
  return useQuery({
    queryKey: ["coupon", lockId, couponCode],
    queryFn: () => validateCouponApi({ couponCode, lockId }),
    enabled: Boolean(couponCode && lockId),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};