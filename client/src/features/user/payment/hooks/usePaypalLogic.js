import toast from "react-hot-toast";
import {
  capturePayPalOrder,
  createPayPalOrder,
} from "../services/payment.service";
import { useNavigate } from "react-router-dom";

export const usePaypalLogic = (eventSlug) => {
  const lockId = sessionStorage.getItem("lockId");
  const navigate = useNavigate();

  const createOrder = async () => {
    try {
      const order = await createPayPalOrder(lockId);
      return order.id;
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error(error.message);
    }
  };

  const onApprove = async (data) => {
    const orderID = data.orderID
    await capturePayPalOrder(orderID, lockId);
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
