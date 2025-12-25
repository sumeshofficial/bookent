import { api } from "../../../../services/api/apiSetup.js";

export const createPayPalOrder = async ({ lockId, couponCode }) => {
  const { data } = await api.post(
    "/user/checkout/payment/paypal/create-order",
    { lockId, couponCode }
  );
  return data;
};

export const capturePayPalOrder = async ({ orderID, lockId, couponCode }) => {
  await api.post("/user/checkout/payment/paypal/capture", {
    orderID,
    lockId,
    couponCode,
  });
};

export const fetchOrderStatus = async (orderId) => {
  const { data } = await api.get(`/user/checkout/order-status/${orderId}`);
  return data;
};
