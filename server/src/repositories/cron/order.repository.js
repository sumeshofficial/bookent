import Order from "../../models/order.model.js";
import { REFUND_STATUS } from "../../utility/constants/constants.js";

export const updateOrderStatus = async (query, newData, session) => {
  return await Order.updateMany(query, newData, { session });
};

export const findAllOrders = async () => {
  return Order.find({
    refundStatus: REFUND_STATUS.PENDING,
  });
};
