import { aggregateOrders } from "../../../../repositories/organizer/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";

export const getSalesStatistics = async (organizerId, filters) => {
  const getDateMatch = (filters) => {
    const match = {};
    if (filters.fromDate || filters.toDate) {
      match.createdAt = {};
      if (filters.fromDate) {
        match.createdAt.$gte = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        match.createdAt.$lte = new Date(filters.toDate);
      }
    } else if (filters.year && filters.month) {
      const year = parseInt(filters.year, 10);
      const month = parseInt(filters.month, 10);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      match.createdAt = { $gte: startDate, $lte: endDate };
    } else if (filters.year) {
      const year = parseInt(filters.year, 10);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      match.createdAt = { $gte: startDate, $lte: endDate };
    } else {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      const endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      match.createdAt = { $gte: startDate, $lte: endDate };
    }
    return match;
  };

  const dateMatch = getDateMatch(filters);

  const rawStats = await aggregateOrders([
    {
      $match: {
        status: {
          $in: [
            ORDER_STATUS.PAID,
            ORDER_STATUS.CONFIRMED,
            ORDER_STATUS.REFUNDED,
          ],
        },
        ...dateMatch,
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
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        sales: { $sum: 1 },
        revenue: {
          $sum: {
            $subtract: [
              { $multiply: ["$seat.price", "$seat.qty"] },
              { $ifNull: ["$refundedAmount", 0] },
            ],
          },
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  const year = filters?.year
    ? parseInt(filters.year, 10)
    : new Date().getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthMap = new Map();

  rawStats.forEach((item) => {
    monthMap.set(item._id.month, {
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      sales: item.sales,
      revenue: Number(item.revenue.toFixed(2)),
    });
  });

  const finalStats = [];

  for (let m = 1; m <= 12; m++) {
    if (monthMap.has(m)) {
      finalStats.push(monthMap.get(m));
    } else {
      finalStats.push({
        month: `${monthNames[m - 1]} ${year}`,
        sales: 0,
        revenue: 0,
      });
    }
  }

  return finalStats;
};
