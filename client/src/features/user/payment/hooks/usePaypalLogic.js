import toast from "react-hot-toast";
import { capturePayPalOrder, createPayPalOrder } from "../services/payment.service";

export const usePaypalLogic = () => {
  const lockId = sessionStorage.getItem("lockId");

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
    const result = await capturePayPalOrder(data.orderID, lockId);
    console.log("PayPal payment success:", result);
    toast.success("Payment successful!");
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    toast.error("Payment failed");
  };

  const onCancel = () => {
    console.log("Payment cancelled");
    toast.error("Payment cancelled by user");
  };

  const styles = {
    color: "white",
  };

  return { createOrder, onApprove, onError, onCancel, styles };
};