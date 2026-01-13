import { ORDER_STATUS } from "../../utility/constants/constants.js";

export const buildOrdersQuery = ({
  page = 1,
  limit = 10,
  sort = "latest",
  fromDate,
  toDate,
  preset = "month",
  isExport = false,
}) => {
  const query = {
    status: {
      $in: [ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, ORDER_STATUS.REFUNDED],
    },
  };

  let dateFilter = {};

  if (fromDate) {
    dateFilter.$gte = new Date(fromDate);
  }

  if (toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    dateFilter.$lte = end;
  }

  if (preset) {
    const now = new Date();
    let start;
    const end = new Date();

    end.setHours(23, 59, 59, 999);

    switch (preset) {
      case "day":
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        break;

      case "week":
        start = new Date(now);
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        break;

      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        break;

      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        start.setHours(0, 0, 0, 0);
        break;

      default:
        start = null;
    }

    if (start) {
      dateFilter = { $gte: start, $lte: end };
    }
  }

  if (Object.keys(dateFilter).length) {
    query.createdAt = dateFilter;
  }

  const sortMap = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    amount_high: { "pricingBreakDown.grandTotal": -1 },
    amount_low: { "pricingBreakDown.grandTotal": 1 },
  };

  const sortQuery = sortMap[sort] || sortMap.latest;

  let pagination = null;

  if (!isExport) {
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    pagination = {
      skip,
      limit: limitNum,
      page: pageNum,
    };
  }

  return {
    query,
    sort: sortQuery,
    pagination,
  };
};
