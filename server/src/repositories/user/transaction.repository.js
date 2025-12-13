import Transaction from "../../models/transaction.model.js";

export const createMoneyTransaction = async (payload, session) => {
  await Transaction.create([payload], { session });
};
