import Order from "../../models/order.model.js";
import { buildSalesReportPipeline } from "./helper/buildSalesReport.js";

export const fetchSalesReport = async ({
  query,
  pagination,
  sort = { createdAt: -1 },
}) => {
  const pipeline = buildSalesReportPipeline(
    query,
    sort,
    pagination?.skip,
    pagination?.limit
  );

  const [result] = await Order.aggregate(pipeline);

  const total = result.meta[0]?.total || 0;

  return {
    data: result.data,
    summary: result.summary[0] || {
      totalOrders: 0,
      grossTicketSales: 0,
      totalDiscount: 0,
      totalRefunded: 0,
      platformGrossCollected: 0,
      totalGatewayFees: 0,
      platformNetRevenue: 0,
    },
    meta: {
      total,
      page: pagination?.page,
      limit: pagination?.limit,
      totalPages: Math.ceil(total / pagination?.limit),
    },
  };
};

export const aggregateOrders = (pipeline) => {
  return Order.aggregate(pipeline);
};

export const fetchOrders = async (query, limit) => {
  return Order.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select({
      orderId: 1,
      status: 1,
      paymentMethod: 1,
      createdAt: 1,
      refundedAmount: 1,
      refundStatus: 1,
      "pricingBreakDown.grandTotal": 1,
      "eventDetails.title": 1,
    })
    .lean();
};