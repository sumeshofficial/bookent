import { aggregateOrders } from "../../../../repositories/admin/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";

export const getMonthlySales = async (organizerId, filters = {}) => {
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
        if (filters.fromDate) {
          start = filters.fromDate;
        }
        if (filters.toDate) {
          end = filters.toDate;
        }
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
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    {
      $unwind: "$event",
    },
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
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        grossTicketSales: { $sum: "$grossTicketSales" },
        organizerNetRevenue: { $sum: "$organizerNetRevenue" },
        totalRefunded: { $sum: "$refundedAmount" },
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
      grossTicketSales: found?.grossTicketSales || 0,
      value: found?.organizerNetRevenue || 0,
      totalOrders: found?.totalOrders || 0,
    });
  }

  return result;
};
