import { aggregateOrders } from "../../../../repositories/admin/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";

export const getRevenueSplit = async (filters = {}) => {
  const matchStage = {
    status: {
      $in: [ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, ORDER_STATUS.REFUNDED],
    },
  };

  const now = new Date();

  const preset = filters.preset || "year";
  let start;
  let end;

  switch (preset) {
    case "custom": {
      if (filters.fromDate && filters.toDate) {
        start = new Date(filters.fromDate);
        start.setHours(0, 0, 0, 0);

        end = new Date(filters.toDate);
        end.setHours(23, 59, 59, 999);
      }
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

  if (start && end) {
    matchStage.createdAt = { $gte: start, $lte: end };
  }

  if (filters.eventId) {
    matchStage.eventId = filters.eventId;
  }

  if (filters.organizerId) {
    matchStage["eventDetails.organizer"] = filters.organizerId;
  }

  const result = await aggregateOrders([
    { $match: matchStage },

    {
      $lookup: {
        from: "transactions",
        let: { orderId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$order_id", "$$orderId"] },
                  { $eq: ["$type", "SALE"] },
                  { $eq: ["$status", "COMPLETED"] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              gatewayFee: { $ifNull: ["$transaction_fees.value", 0] },
            },
          },
        ],
        as: "transaction",
      },
    },

    {
      $addFields: {
        gatewayFee: {
          $ifNull: [{ $first: "$transaction.gatewayFee" }, 0],
        },
        grossTicketSales: {
          $multiply: ["$pricingBreakDown.ticketPrice", "$seat.qty"],
        },
        discount: { $ifNull: ["$pricingBreakDown.discount", 0] },
        platformGrossFee: {
          $ifNull: ["$pricingBreakDown.bookingFee", 0],
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
        _id: null,
        platformGrossFee: { $sum: "$platformGrossFee" },
        gatewayFee: { $sum: "$gatewayFee" },
        discount: { $sum: "$discount" },
        platformNetRevenue: { $sum: "$platformNetRevenue" },
      },
    },
  ]);

  const data = result[0] || {
    platformGrossFee: 0,
    gatewayFee: 0,
    discount: 0,
    platformNetRevenue: 0,
  };

  return [
    { name: "Platform Gross Fee", value: data.platformGrossFee },
    { name: "Gateway Fees", value: data.gatewayFee },
    { name: "Platform Discounts", value: data.discount },
    { name: "Platform Net Revenue", value: data.platformNetRevenue },
  ];
};
