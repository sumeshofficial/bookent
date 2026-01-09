import { aggregateOrders } from "../../../../repositories/organizer/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";

export const getRecentOrders = async (organizerId, limit = 5) => {
  const orders = await aggregateOrders([
    {
      $match: {
        status: {
          $in: [
            ORDER_STATUS.PAID,
            ORDER_STATUS.CONFIRMED,
            ORDER_STATUS.REFUNDED,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $match: {
        "event.organizer": organizerId,
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        orderId: 1,
        status: 1,
        paymentMethod: 1,
        refundStatus: 1,
        refundedAmount: { $ifNull: ["$refundedAmount", 0] },
        createdAt: 1,
        amount: { $ifNull: ["$pricingBreakDown.grandTotal", 0] },
        eventTitle: "$event.title",
      },
    },
  ]);

  return orders;
};
