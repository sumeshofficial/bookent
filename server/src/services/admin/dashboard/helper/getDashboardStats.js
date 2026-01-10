import { aggregateOrders } from "../../../../repositories/admin/order.repository.js";
import { aggregateTransactions } from "../../../../repositories/admin/transaction.repository.js";
import { countUsers } from "../../../../repositories/admin/user.respository.js";
import {
  ORDER_STATUS,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../../../utility/constants/constants.js";

export const getDashboardStats = async (filters = {}) => {
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

    case "custom": {
      if (filters.fromDate && filters.toDate) {
        start = new Date(filters.fromDate);
        start.setHours(0, 0, 0, 0);

        end = new Date(filters.toDate);
        end.setHours(23, 59, 59, 999);
      } else {
        const year = Number(filters.year) || now.getFullYear();

        start = new Date(year, 0, 1);
        start.setHours(0, 0, 0, 0);

        end = new Date(year, 11, 31);
        end.setHours(23, 59, 59, 999);
      }
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

  const totalUsers = await countUsers({
    role: "user",
    status: "active",
  });

  const [ordersAgg] = await aggregateOrders([
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
      $group: {
        _id: null,

        totalOrders: {
          $sum: 1,
        },

        grossTicketSales: {
          $sum: {
            $multiply: ["$seat.price", "$seat.qty"],
          },
        },

        totalDiscount: {
          $sum: { $ifNull: ["$pricingBreakDown.discount", 0] },
        },

        totalRefunded: {
          $sum: { $ifNull: ["$refundedAmount", 0] },
        },

        platformGrossCollected: {
          $sum: { $ifNull: ["$pricingBreakDown.bookingFee", 0] },
        },
      },
    },
  ]);

  const [transactionsAgg] = await aggregateTransactions([
    {
      $match: {
        type: TRANSACTION_TYPE.SALE,
        status: TRANSACTION_STATUS.COMPLETED,
        ...createdAtMatch,
      },
    },
    {
      $group: {
        _id: null,

        totalGatewayFees: {
          $sum: { $ifNull: ["$transaction_fees.value", 0] },
        },
      },
    },
  ]);

  const platformGrossCollected = ordersAgg?.platformGrossCollected || 0;
  const totalGatewayFees = transactionsAgg?.totalGatewayFees || 0;
  const totalDiscount = ordersAgg?.totalDiscount || 0;

  const platformNetRevenue =
    platformGrossCollected - totalGatewayFees - totalDiscount;

  return {
    totalUsers,
    totalOrders: ordersAgg?.totalOrders || 0,
    grossTicketSales: ordersAgg?.grossTicketSales || 0,
    totalDiscount: totalDiscount,
    totalRefunded: ordersAgg?.totalRefunded || 0,

    platformGrossCollected: platformGrossCollected,

    totalGatewayFees: totalGatewayFees,

    platformNetRevenue: platformNetRevenue,
  };
};
