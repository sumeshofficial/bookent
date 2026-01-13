import express from "express";
import {
  exportWalletCSV,
  exportWalletExcel,
  getUserWalletSummaryController,
  getUserWalletTransactionsController,
} from "../../controller/user/wallet.controller.js";

const router = express.Router();

router.get("/summary", getUserWalletSummaryController);
router.get("/transactions", getUserWalletTransactionsController);
router.get("/export/csv", exportWalletCSV);
router.get("/export/excel", exportWalletExcel);

export default router;
