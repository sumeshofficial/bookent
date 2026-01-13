import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCoupon } from "../services/coupon.service";

export const useCouponUpdate = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ couponId, updateData }) => {
      return updateCoupon(couponId, updateData);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Coupon updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (err) => {
      toast.dismiss();
      toast.error(err?.response?.data?.message || "Failed to update coupon");
    },
  });

  return {
    updateCoupon: mutate,
    isUpdating: isPending,
    isError,
    error,
  };
};
