import toast from "react-hot-toast";
import {
  capturePayPalOrder,
  createPayPalOrder,
} from "../services/payment.service";
import { useNavigate } from "react-router-dom";

export const usePaypalLogic = (eventSlug) => {
  const lockId = sessionStorage.getItem("lockId");
  const couponCode = sessionStorage.getItem("appliedCoupon");
  const navigate = useNavigate();

  const createOrder = async () => {
    try {
      const order = await createPayPalOrder({
        lockId,
        couponCode,
      });
      return order.id;
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.error?.message);
    }
  };

  const onApprove = async (data) => {
    const orderID = data.orderID;
    const order = await capturePayPalOrder({
      orderID,
      lockId,
      couponCode,
    });
    sessionStorage.removeItem("appliedCoupon");
    navigate(
      `/payment-processing?orderId=${order.orderId}&eventSlug=${eventSlug}`
    );
  };

  const onError = (error) => {
    toast.error(
      error?.response?.data?.error.message ||
        error.message ||
        "Something went wrong"
    );
  };

  const onCancel = () => {
    toast.error("Payment cancelled by user");
  };

  const styles = {
    color: "white",
  };

  return { createOrder, onApprove, onError, onCancel, styles };
};
