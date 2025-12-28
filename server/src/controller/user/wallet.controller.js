import {
  fetchWalletSummary,
  getCSVForTransaction,
  getExcelForTransaction,
  userWalletService,
} from "../../services/user/wallet/wallet.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

export const getUserWalletSummaryController = asyncHandler(async (req, res) => {
  const user = req.user;
  const summary = await fetchWalletSummary(user._id);

  sendResponse(res, summary, STATUS_CODE.SUCCESS);
});

export const getUserWalletTransactionsController = asyncHandler(
  async (req, res) => {
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
    const userId = req.user._id;
    const transactions = await userWalletService({
      userId,
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
  }
);

export const exportWalletCSV = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const csv = await getCSVForTransaction(userId);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=wallet-report.csv"
  );

  res.send(csv);
});

export const exportWalletExcel = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workbook = await getExcelForTransaction(userId);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=wallet-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});
