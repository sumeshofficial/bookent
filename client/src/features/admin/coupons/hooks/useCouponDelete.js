import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCoupon } from "../services/coupon.service";

export const useCouponDelete = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (couponId) => deleteCoupon(couponId),

    onSuccess: () => {
      toast.dismiss();
      toast.success("Coupon deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (err) => {
      toast.dismiss();
      toast.error(err?.response?.data?.message || "Failed to delete coupon");
    },
  });

  return {
    deleteCoupon: mutate,
    isDeleting: isPending,
    isError,
    error,
  };
};
