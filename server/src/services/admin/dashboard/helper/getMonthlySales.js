import { aggregateOrders } from "../../../../repositories/admin/order.repository.js";
import {
  ORDER_STATUS,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../../../utility/constants/constants.js";

export const getMonthlySales = async (filters = {}) => {
  const dateMatch = {};
  const now = new Date();
  const year = filters.year ? Number(filters.year) : now.getFullYear();

  let start;
  let end;

  const preset = filters.preset || "year";

  switch (preset) {
    case "day": {
      start = new Date(now);
      start.setHours(0, 0, 0, 0);

      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case "week": {
      const day = now.getDay() === 0 ? 6 : now.getDay() - 1;

      start = new Date(now);
      start.setDate(now.getDate() - day);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case "month": {
      const month =
        filters.month !== undefined
          ? Number(filters.month) - 1
          : now.getMonth();

      start = new Date(year, month, 1, 0, 0, 0, 0);
      end = new Date(year, month + 1, 0, 23, 59, 59, 999);
      break;
    }

    case "custom": {
      if (filters.fromDate && filters.toDate) {
        start = new Date(filters.fromDate);
        start.setHours(0, 0, 0, 0);

        end = new Date(filters.toDate);
        end.setHours(23, 59, 59, 999);
      } else {
        start = new Date(year, 0, 1, 0, 0, 0, 0);
        end = new Date(year, 11, 31, 23, 59, 59, 999);
      }
      break;
    }

    case "year":
    default: {
      start = new Date(year, 0, 1, 0, 0, 0, 0);
      end = new Date(year, 11, 31, 23, 59, 59, 999);
      break;
    }
  }

  dateMatch.$gte = start;
  dateMatch.$lte = end;

  const createdAtMatch = { createdAt: dateMatch };

  const data = await aggregateOrders([
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
      $lookup: {
        from: "transactions",
        let: { orderObjectId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$order_id", "$$orderObjectId"] },
                  { $eq: ["$type", TRANSACTION_TYPE.SALE] },
                  { $eq: ["$status", TRANSACTION_STATUS.COMPLETED] },
                ],
              },
            },
          },
        ],
        as: "transaction",
      },
    },

    { $unwind: "$transaction" },

    {
      $addFields: {
        platformGrossFee: {
          $ifNull: ["$pricingBreakDown.bookingFee", 0],
        },
        gatewayFee: {
          $ifNull: ["$transaction.transaction_fees.value", 0],
        },
        discount: {
          $ifNull: ["$pricingBreakDown.discount", 0],
        },
      },
    },

    {
      $addFields: {
        platformNetRevenue: {
          $subtract: [
            "$platformGrossFee",
            { $add: ["$gatewayFee", "$discount"] },
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
        platformGrossCollected: { $sum: "$platformGrossFee" },
        platformNetRevenue: { $sum: "$platformNetRevenue" },
        totalOrders: { $sum: 1 },
      },
    },

    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const result = [];

  const selectedYear = year;

  for (let m = 0; m < 12; m++) {
    const year = selectedYear;
    const month = m + 1;
    const cursor = new Date(selectedYear, m, 1);

    const found = data.find(
      (d) => d._id.year === year && d._id.month === month
    );

    result.push({
      year,
      month,
      label: cursor.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }),
      platformGrossCollected: found?.platformGrossCollected || 0,
      value: found?.platformNetRevenue || 0,
      totalOrders: found?.totalOrders || 0,
    });
  }

  return result;
};
