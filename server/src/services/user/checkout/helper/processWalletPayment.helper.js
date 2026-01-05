import { updateAdminWallet } from "../../../../repositories/admin/updateAdminWallet.js";
import { createMoneyTransaction } from "../../../../repositories/user/transaction.repository.js";
import { updateUserWalletBalance } from "../../../../repositories/user/user.repository.js";
import { buildWalletTransactionPayload } from "./buildWalletTransactionPayload.js";

export const processWalletPayment = async ({
  userId,
  amount,
  order,
  session,
}) => {
  await updateUserWalletBalance(userId, amount, session);

  const txnPayload = buildWalletTransactionPayload(order);
  await createMoneyTransaction(txnPayload, session);

  await updateAdminWallet(txnPayload.net_amount.value, session);
};