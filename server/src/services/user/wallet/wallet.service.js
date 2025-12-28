import { findUserById } from "../../../repositories/user/user.repository.js";
import {
  walletSummary,
  walletTransactions,
} from "../../../repositories/user/wallet.repository.js";
import { buildCSV } from "./helper/buildCSV.js";
import { buildExcel } from "./helper/buildExcel.js";

export const fetchWalletSummary = async (userId) => {
  const summary = await walletSummary(userId);
  const user = await findUserById(userId);

  return { ...summary, balance: user.wallet };
};

/**
 * Fetch all wallet transactions for a specific user.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Array<{
 *   _id: string,
 *   amount: number,
 *   type: string,
 *   status: string,
 *   createdAt: Date
 * }>>}
 * @throws {AppError} If user not found or wallet fetch fails
 */
export const userWalletService = async ({
  userId,
  page = 1,
  limit = 10,
  status,
  reason,
  type,
  fromDate,
  toDate,
  sort = "latest",
}) => {
  const filters = {
    userId,
    page: Number(page),
    limit: Number(limit),
    status,
    reason,
    transaction_direction: type,
    fromDate,
    toDate,
    sort,
  };

  const transactions = await walletTransactions(filters);

  return transactions;
};

export const getCSVForTransaction = async (userId) => {
  const { data } = await walletTransactions({
    limit: 100000,
    page: 1,
    sort: "latest",
    userId,
  });

  const csv = buildCSV(data);

  return csv;
};

export const getExcelForTransaction = async (userId) => {
  const { data } = await walletTransactions({
    limit: 100000,
    page: 1,
    sort: "latest",
    userId,
  });

  const excel = buildExcel(data);

  return excel;
};
