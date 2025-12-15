import {
  fetchWalletSummary,
  fetchWalletTransactions,
  getCSVForTransaction,
  getExcelForTransaction,
} from "../../services/admin/wallet.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

export const getWalletSummary = asyncHandler(async (req, res) => {
  const summary = await fetchWalletSummary();

  sendResponse(res, summary, STATUS_CODE.SUCCESS);
});

export const getWalletTransactions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    reason,
    type,
    fromDate,
    toDate,
    sort,
  } = req.query;
  const transactions = await fetchWalletTransactions({
    page,
    limit,
    status,
    reason,
    type,
    fromDate,
    toDate,
    sort,
  });

  sendResponse(res, transactions, STATUS_CODE.SUCCESS);
});

export const exportAdminWalletCSV = asyncHandler(async (req, res) => {
  const csv = await getCSVForTransaction();

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=admin-wallet-report.csv"
  );

  res.send(csv);
});

export const exportAdminWalletExcel = asyncHandler(async (req, res) => {
  const workbook = await getExcelForTransaction();

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=admin-wallet-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});