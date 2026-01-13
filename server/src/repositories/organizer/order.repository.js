import Order from "../../models/order.model.js";
import { buildSalesReportPipeline } from "./helper/buildSalesReportPipeline.js";
import { orderQueryBuilder } from "./helper/order.query.js";

export const verifyUserTicket = async (orderId, userId) => {
  return Order.findOneAndUpdate(
    { orderId, userId: userId },
    {
      $set: {
        "qrData.isUsed": true,
        "qrData.usedAt": new Date(),
      },
    },
    { new: true }
  );
};

/**
 * Get bookings for an organizer-owned event
 *
 * @param {string} eventId
 * @param {Object} filters
 * @returns {Promise<{ data: Array, meta: Object }>}
 */
export const getAllOrdersForEvent = async (eventId, filters = {}) => {
  const { query, page, sortQuery, limit, skip } = orderQueryBuilder(
    eventId,
    filters
  );

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("eventId")
      .sort(sortQuery)
      .limit(limit)
      .skip(skip),
    Order.countDocuments(query),
  ]);

  return {
    data: orders,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const fetchOrdersForOrganizer = async ({
  query,
  pagination,
  sort = { createdAt: -1 },
  eventIds,
}) => {
  if (!eventIds?.length) {
    return {
      data: [],
      summary: {
        totalOrders: 0,
        grossTicketSales: 0,
        totalRefunded: 0,
        organizerNetRevenue: 0,
      },
      meta: {
        total: 0,
        page: pagination?.page,
        limit: pagination?.limit,
        totalPages: 0,
      },
    };
  }

  query.eventId = { $in: eventIds };

  const pipeline = buildSalesReportPipeline(
    query,
    sort,
    pagination?.skip,
    pagination?.limit
  );

  const [result] = await Order.aggregate(pipeline);

  const total = result?.meta?.[0]?.total || 0;

  return {
    data: result?.data || [],
    summary: result?.summary?.[0] || {
      totalOrders: 0,
      grossTicketSales: 0,
      totalRefunded: 0,
      organizerNetRevenue: 0,
    },
    meta: {
      total,
      page: pagination?.page,
      limit: pagination?.limit,
      totalPages: pagination?.limit ? Math.ceil(total / pagination.limit) : 1,
    },
  };
};

export const aggregateOrders = (pipeline) => {
  return Order.aggregate(pipeline);
};
