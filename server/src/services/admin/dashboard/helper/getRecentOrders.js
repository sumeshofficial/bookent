import { fetchOrders } from "../../../../repositories/admin/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";

export const getRecentOrders = async (limit = 5) => {
  const orders = await fetchOrders(
    {
      status: {
        $in: [ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, ORDER_STATUS.REFUNDED],
      },
    },
    limit
  );

  return orders.map((order) => ({
    orderId: order.orderId,
    eventTitle: order.eventDetails?.title,
    status: order.status,
    paymentMethod: order.paymentMethod,
    amount: order.pricingBreakDown?.grandTotal || 0,
    refundStatus: order.refundStatus,
    refundedAmount: order.refundedAmount || 0,
    createdAt: order.createdAt,
  }));
};
