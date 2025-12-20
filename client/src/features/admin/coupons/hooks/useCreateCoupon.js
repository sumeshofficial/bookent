import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCouponService } from "../services/coupon.service";
import toast from "react-hot-toast";

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCouponService,

    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });

      toast.success("Coupon created successfully");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Failed to create coupon";

      toast.error(message);
    },
  });
};
