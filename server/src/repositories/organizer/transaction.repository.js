import Transaction from "../../models/transaction.model.js";

export const aggregateTransactions = (pipeline) => {
  return Transaction.aggregate(pipeline);
};