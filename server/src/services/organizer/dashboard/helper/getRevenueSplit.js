import { aggregateOrders } from "../../../../repositories/organizer/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";

export const getRevenueSplit = async (organizerId, filters = {}) => {
  const matchStage = {
    status: {
      $in: [ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, ORDER_STATUS.REFUNDED],
    },
  };

  const dateMatch = {};
  const now = new Date();

  if (!filters.fromDate && !filters.toDate && !filters.preset) {
    const year = Number(filters.year) || now.getFullYear();
    dateMatch.$gte = new Date(year, 0, 1);
    dateMatch.$lte = new Date(year, 11, 31, 23, 59, 59, 999);
  }

  if (filters.fromDate) {
    dateMatch.$gte = new Date(filters.fromDate);
  }

  if (filters.toDate) {
    const end = new Date(filters.toDate);
    end.setHours(23, 59, 59, 999);
    dateMatch.$lte = end;
  }

  if (filters.preset) {
    let start, end;

    switch (filters.preset) {
      case "day":
        start = new Date();
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setHours(23, 59, 59, 999);
        break;

      case "week": {
        const day = now.getDay() || 7;
        start = new Date(now);
        start.setDate(now.getDate() - day + 1);
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
        end = new Date(year, month + 1, 0, 23, 59, 59, 999);
        break;
      }

      case "year": {
        const year = Number(filters.year) || now.getFullYear();
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31, 23, 59, 59, 999);
        break;
      }
    }

    if (start && end) {
      dateMatch.$gte = start;
      dateMatch.$lte = end;
    }
  }

  if (Object.keys(dateMatch).length) {
    matchStage.createdAt = dateMatch;
  }

  if (filters.eventId) {
    matchStage.eventId = filters.eventId;
  }

  const result = await aggregateOrders([
    { $match: matchStage },

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
      $addFields: {
        grossTicketSales: {
          $multiply: ["$seat.price", "$seat.qty"],
        },
        refundedAmount: {
          $ifNull: ["$refundedAmount", 0],
        },
        organizerNetRevenue: {
          $subtract: [
            { $multiply: ["$seat.price", "$seat.qty"] },
            { $ifNull: ["$refundedAmount", 0] },
          ],
        },
      },
    },

    {
      $group: {
        _id: null,
        grossTicketSales: { $sum: "$grossTicketSales" },
        totalRefunded: { $sum: "$refundedAmount" },
        organizerNetRevenue: { $sum: "$organizerNetRevenue" },
      },
    },
  ]);

  const data = result[0] || {
    grossTicketSales: 0,
    totalRefunded: 0,
    organizerNetRevenue: 0,
  };

  return [
    { name: "Gross Ticket Sales", value: data.grossTicketSales },
    { name: "Refunded Amount", value: data.totalRefunded },
    { name: "Organizer Net Revenue", value: data.organizerNetRevenue },
  ];
};
