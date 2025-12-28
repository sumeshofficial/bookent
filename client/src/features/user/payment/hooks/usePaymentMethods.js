import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { PAYMENT_METHODS } from "../constants/payment.constants.js";
import { createWalletOrder } from "../services/payment.service.js";
import toast from "react-hot-toast";
import { useModal } from "../../../../utils/constants.js";

export const usePaymentMethods = () => {
  const lockId = sessionStorage.getItem("lockId");
  const couponCode = sessionStorage.getItem("appliedCoupon");
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const walletPaymentMutation = useMutation({
    mutationFn: () =>
      createWalletOrder({
        lockId,
        couponCode,
      }),
    onSuccess: (data) => {
      closeModal();
      sessionStorage.removeItem("appliedCoupon");
      navigate(
        `/payment-processing?orderId=${data?.orderId}&eventSlug=${data?.eventDetails?.slug}`
      );
    },
    onError: (error) => {
      closeModal();
      toast.error(error.message);
      console.error("Wallet payment failed:", error);
    },
  });

  const methods = [
    {
      ...PAYMENT_METHODS.PAYPAL,
    },
    {
      ...PAYMENT_METHODS.WALLET,
    },
  ];

  return {
    methods,
    onClick: walletPaymentMutation.mutate,
    isLoading: walletPaymentMutation.isPending,
    error: walletPaymentMutation.error,
  };
};
