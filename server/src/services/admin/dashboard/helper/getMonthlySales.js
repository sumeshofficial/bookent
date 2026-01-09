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

  if (filters.fromDate) {
    dateMatch.$gte = new Date(filters.fromDate);
  }

  if (filters.toDate) {
    const end = new Date(filters.toDate);
    end.setHours(23, 59, 59, 999);
    dateMatch.$lte = end;
  }

  if (filters.preset) {
    let start;
    let end;

    switch (filters.preset) {
      case "day": {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);

        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;
      }

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
        const month = filters.month
          ? Number(filters.month) - 1
          : now.getMonth();

        start = new Date(year, month, 1, 0, 0, 0, 0);
        end = new Date(year, month + 1, 0, 23, 59, 59, 999);
        break;
      }

      case "year": {
        start = new Date(year, 0, 1, 0, 0, 0, 0);
        end = new Date(year, 11, 31, 23, 59, 59, 999);
        break;
      }

      default:
        start = null;
        end = null;
    }

    if (start && end) {
      dateMatch.$gte = start;
      dateMatch.$lte = end;
    }
  }

  const createdAtMatch = Object.keys(dateMatch).length
    ? { createdAt: dateMatch }
    : {};

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
