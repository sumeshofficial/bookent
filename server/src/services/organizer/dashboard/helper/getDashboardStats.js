import { aggregateOrders } from "../../../../repositories/admin/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";

export const getDashboardStats = async (organizerId, filters = {}) => {
  const dateMatch = {};
  const now = new Date();

  const preset = filters.preset || "year";
  let start;
  let end;

  switch (preset) {
    case "day": {
      start = new Date(now);
      start.setHours(0, 0, 0, 0);

      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case "week": {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

      start = new Date(now);
      start.setDate(now.getDate() + diffToMonday);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case "month": {
      const year = Number(filters.year) || now.getFullYear();
      const month =
        filters.month !== undefined
          ? Number(filters.month) - 1
          : now.getMonth();

      start = new Date(year, month, 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(year, month + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case "year":
    default: {
      const year = Number(filters.year) || now.getFullYear();

      start = new Date(year, 0, 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(year, 11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    }
  }

  dateMatch.$gte = start;
  dateMatch.$lte = end;

  const createdAtMatch = { createdAt: dateMatch };

  const [ordersAgg] = await aggregateOrders([
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
    {
      $match: {
        status: {
          $in: [
            ORDER_STATUS.PAID,
            ORDER_STATUS.CONFIRMED,
            ORDER_STATUS.REFUNDED,
          ],
        },
        ...createdAtMatch,
      },
    },
    {
      $addFields: {
        grossTicketSales: {
          $multiply: ["$seat.price", "$seat.qty"],
        },
        refundedAmount: {
          $ifNull: ["$refundedAmount", 0],
        },
      },
    },
    {
      $addFields: {
        organizerNetRevenue: {
          $subtract: ["$grossTicketSales", "$refundedAmount"],
        },
      },
    },
    {
      $group: {
        _id: null,

        totalOrders: { $sum: 1 },

        grossTicketSales: { $sum: "$grossTicketSales" },

        totalRefunded: { $sum: "$refundedAmount" },

        organizerNetRevenue: { $sum: "$organizerNetRevenue" },
      },
    },
  ]);

  return {
    totalOrders: ordersAgg?.totalOrders || 0,
    grossTicketSales: ordersAgg?.grossTicketSales || 0,
    totalRefunded: ordersAgg?.totalRefunded || 0,
    organizerNetRevenue: ordersAgg?.organizerNetRevenue || 0,
  };
};
