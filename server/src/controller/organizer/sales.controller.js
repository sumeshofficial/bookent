import {
  exportSalesReportAsExcel,
  exportSalesReportAsPDF,
  getSalesReport,
} from "../../services/organizer/sales.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

export const getSalesReportController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const salesReport = await getSalesReport(userId, req.query);

  sendResponse(res, salesReport, STATUS_CODE.SUCCESS);
});

export const downloadSalesPDFController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const doc = await exportSalesReportAsPDF(userId, req.query);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=sales-report.pdf");

  doc.pipe(res);
});

export const downloadSalesExcelController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workbook = await exportSalesReportAsExcel(userId, req.query);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=sales-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});
