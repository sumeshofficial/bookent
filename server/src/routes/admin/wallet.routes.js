import express from "express";
import {
  exportAdminWalletCSV,
  exportAdminWalletExcel,
  getWalletSummary,
  getWalletTransactions,
} from "../../controller/admin/walllet.controller.js";
const router = express.Router();

router.get("/summary", getWalletSummary);
router.get("/transactions", getWalletTransactions);
router.get("/export/csv", exportAdminWalletCSV);
router.get("/export/excel", exportAdminWalletExcel);

export default router;
