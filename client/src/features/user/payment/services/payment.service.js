import { api } from "../../../../services/api/apiSetup.js";

export const createPayPalOrder = async (lockId) => {
  const { data } = await api.post(
    "/user/checkout/payment/paypal/create-order",
    { lockId }
  );
  return data;
};

export const capturePayPalOrder = async (orderID, lockId) => {
  await api.post("/user/checkout/payment/paypal/capture", {
    orderID,
    lockId,
  });
};

export const fetchOrderStatus = async (orderId) => {
  const { data } = await api.get(`/user/checkout/order-status/${orderId}`);
  return data;
};
