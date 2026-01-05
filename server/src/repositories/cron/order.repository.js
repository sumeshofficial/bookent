import Order from "../../models/order.model.js";

export const updateOrderStatus = async (query, newData, session) => {
  return await Order.updateMany(query, newData, { session });
};

export const findAllOrders = async (query, session = null) => {
  return Order.find(query).session(session);
};
