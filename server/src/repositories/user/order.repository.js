import Order from "../../models/order.model.js";

export const getOrderForPaypal = async (paypalOrderId, session = null) => {
  return await Order.findOne({ paypalOrderId }, null, { session });
};

export const createOrder = async (data, session) => {
  await Order.create([data], { session });
};

export const updateOrderStatus = async (orderId, status, session) => {
  await Order.findOneAndUpdate({ _id: orderId }, { status }, { session });
};