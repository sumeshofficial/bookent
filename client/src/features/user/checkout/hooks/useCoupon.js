import { useMutation } from "@tanstack/react-query";
import { validateCouponApi } from "../services/checkout.service";

export const useCoupon = () => {
  return useMutation({
    mutationFn: ({ couponCode, lockId }) =>
      validateCouponApi({ couponCode, lockId }),
  });
};