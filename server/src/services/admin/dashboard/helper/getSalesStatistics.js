import { aggregateTransactions } from "../../../../repositories/admin/transaction.repository.js";
import {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
} from "../../../../utility/constants/constants.js";

const buildCreatedAtMatch = (filters = {}) => {
  const now = new Date();
  const preset = filters.preset || "year";

  let start;
  let end;

  switch (preset) {
    case "custom": {
      if (!filters.fromDate || !filters.toDate) {
        return {};
      }
      start = new Date(filters.fromDate);
      start.setHours(0, 0, 0, 0);

      end = new Date(filters.toDate);
      end.setHours(23, 59, 59, 999);
      break;
    }

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

  return {
    createdAt: {
      $gte: start,
      $lte: end,
    },
  };
};

export const getSalesStatistics = async (filters) => {
  const dateMatch = buildCreatedAtMatch(filters);

  const rawStats = await aggregateTransactions([
    {
      $match: {
        type: TRANSACTION_TYPE.SALE,
        status: TRANSACTION_STATUS.COMPLETED,
        ...dateMatch,
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "order_id",
        foreignField: "_id",
        as: "order",
      },
    },
    {
      $unwind: {
        path: "$order",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        platformGrossFee: {
          $ifNull: ["$order.pricingBreakDown.bookingFee", 0],
        },
        discount: {
          $ifNull: ["$order.pricingBreakDown.discount", 0],
        },
        gatewayFee: {
          $ifNull: ["$transaction_fees.value", 0],
        },
        platformNetRevenue: {
          $subtract: [
            { $ifNull: ["$order.pricingBreakDown.bookingFee", 0] },
            {
              $add: [
                { $ifNull: ["$transaction_fees.value", 0] },
                { $ifNull: ["$order.pricingBreakDown.discount", 0] },
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        sales: { $sum: 1 },
        revenue: { $sum: "$platformNetRevenue" },
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
