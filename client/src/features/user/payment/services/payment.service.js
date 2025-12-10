import { api } from "../../../../services/api/apiSetup.js"

export const createPayPalOrder = async (lockId) => {
  const { data } = await api.post("/user/checkout/payment/paypal/create-order", {lockId});
  return data;
};

export const capturePayPalOrder = async (orderID, lockId) => {
  const { data } = await api.post("/user/checkout/payment/paypal/capture", { orderID, lockId });
  return data;
};