import Transaction from "../../models/transaction.model.js";
import {
  TRANSACTION_DIRECTION,
  TRANSACTION_STATUS,
} from "../../utility/constants/constants.js";
import {
  buildWalletTransactionQuery,
  buildWalletTransactionSort,
} from "../helper/transaction.query.js";

export const walletSummary = async () => {
  const summary = await Transaction.aggregate([
    {
      $match: {
        status: TRANSACTION_STATUS.COMPLETED,
      },
    },
    {
      $group: {
        _id: "$transaction_direction",
        totalAmount: { $sum: "$net_amount.value" },
        count: { $sum: 1 },
      },
    },
  ]);

  let totalCredit = 0;
  let totalDebit = 0;

  for (const row of summary) {
    if (row._id === TRANSACTION_DIRECTION.CREDIT) {
      totalCredit = row.totalAmount;
    }
    if (row._id === TRANSACTION_DIRECTION.DEBIT) {
      totalDebit = row.totalAmount;
    }
  }

  return {
    totalCredit,
    totalDebit,
  };
};

export const walletTransactions = async ({
  page = 1,
  limit = 10,
  transaction_direction,
  status,
  reason,
  fromDate,
  toDate,
  sort = "latest",
}) => {
  const skip = (page - 1) * limit;

  const query = buildWalletTransactionQuery({
    transaction_direction,
    status,
    reason,
    fromDate,
    toDate,
  });

  const sortOption = buildWalletTransactionSort(sort);

  const [transactions, total] = await Promise.all([
    Transaction.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(query),
  ]);

  return {
    data: transactions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const aggregateTransactions = (pipeline) => {
  return Transaction.aggregate(pipeline);
};
