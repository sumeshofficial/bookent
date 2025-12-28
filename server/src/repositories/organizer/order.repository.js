import Order from "../../models/order.model.js";
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
    Order.find(query).sort(sortQuery).limit(limit).skip(skip),
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
