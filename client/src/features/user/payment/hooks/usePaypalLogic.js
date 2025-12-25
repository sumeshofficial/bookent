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
    const orderID = data.orderID
    await capturePayPalOrder({
      orderID,
      lockId,
      couponCode, 
    });
    sessionStorage.removeItem("appliedCoupon");
    navigate(`/payment-processing?orderId=${orderID}&eventSlug=${eventSlug}`);
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    toast.error("Payment failed");
  };

  const onCancel = () => {
    toast.error("Payment cancelled by user");
  };

  const styles = {
    color: "white",
  };

  return { createOrder, onApprove, onError, onCancel, styles };
};
