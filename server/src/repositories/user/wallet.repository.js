import Transaction from "../../models/transaction.model.js";
import {
  PAYMENT_METHOD,
  TRANSACTION_DIRECTION,
  TRANSACTION_STATUS,
} from "../../utility/constants/constants.js";
import { buildWalletTransactionQuery } from "../helper/transaction.query.js";
import { buildWalletTransactionSort } from "./helper/transaction.sort.js";

const mapDirectionForUser = (direction) =>
  direction === TRANSACTION_DIRECTION.CREDIT
    ? TRANSACTION_DIRECTION.DEBIT
    : TRANSACTION_DIRECTION.CREDIT;

export const walletSummary = async (userId) => {
  const summary = await Transaction.aggregate([
    {
      $match: {
        initiated_by: userId,
        status: TRANSACTION_STATUS.COMPLETED,
        paymentMethod: PAYMENT_METHOD.WALLET,
      },
    },
    {
      $group: {
        _id: "$transaction_direction",
        totalAmount: { $sum: "$net_amount.value" },
      },
    },
  ]);

  let platformCredit = 0;
  let platformDebit = 0;

  for (const row of summary) {
    if (row._id === TRANSACTION_DIRECTION.CREDIT) {
      platformCredit = row.totalAmount;
    }
    if (row._id === TRANSACTION_DIRECTION.DEBIT) {
      platformDebit = row.totalAmount;
    }
  }

  const totalCredit = platformDebit;
  const totalDebit = platformCredit;
  const balance = totalCredit - totalDebit;

  return {
    totalCredit,
    totalDebit,
    balance,
  };
};

export const walletTransactions = async ({
  userId,
  page = 1,
  limit = 10,
  transaction_direction,
  status,
  reason,
  fromDate,
  toDate,
  sort = "latest",
}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const query = buildWalletTransactionQuery({
    userId,
    transaction_direction,
    status,
    reason,
    fromDate,
    toDate,
    paymentMethod: PAYMENT_METHOD.WALLET,
  });

  const sortOption = buildWalletTransactionSort(sort);

  const [transactions, total] = await Promise.all([
    Transaction.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(query),
  ]);

  const userTransactions = transactions.map((tx) => ({
    ...tx,
    display_direction: mapDirectionForUser(tx.transaction_direction),
  }));

  return {
    data: userTransactions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
