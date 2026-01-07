import express from "express";
import {
  downloadSalesExcelController,
  downloadSalesPDFController,
  getSalesReportController,
} from "../../controller/admin/sales.controller.js";

const router = express.Router();

router.get("/", getSalesReportController);
router.get("/export/pdf", downloadSalesPDFController);
router.get("/export/excel", downloadSalesExcelController);

export default router;
