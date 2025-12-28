import { PAYMENT_METHOD } from "../../utility/constants/constants.js";

export const buildWalletTransactionQuery = ({
  userId,
  transaction_direction,
  status,
  reason,
  fromDate,
  toDate,
}) => {
  const query = {
    ...(transaction_direction ? { transaction_direction } : {}),
    ...(status ? { status } : {}),
    ...(reason ? { reason } : {}),
  };

  if (userId) {
    query.initiated_by = userId;
    query.paymentMethod = PAYMENT_METHOD.WALLET;
  }

  if (fromDate || toDate) {
    query.createdAt = {};

    if (fromDate) {
      query.createdAt.$gte = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
    }

    if (toDate) {
      query.createdAt.$lte = new Date(
        new Date(toDate).setHours(23, 59, 59, 999)
      );
    }
  }

  return query;
};

export const buildWalletTransactionSort = (sort = "latest") => {
  const sortMap = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    amount_desc: { "net_amount.value": -1 },
    amount_asc: { "net_amount.value": 1 },
  };

  return sortMap[sort] || sortMap.latest;
};
