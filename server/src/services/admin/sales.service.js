import { buildOrdersQuery } from "../helper/buildOrderQuery.js";
import { exportSalesPDF } from "./helper/exportPdf.js";
import { exportSalesExcel } from "./helper/exportExcel.js";
import { fetchSalesReport } from "../../repositories/admin/order.repository.js";

export const getSalesReport = async (filters) => {
  const queryPayload = buildOrdersQuery({
    ...filters,
  });

  return await fetchSalesReport(queryPayload);
};

export const exportSalesReportAsPDF = async (filters) => {
  const queryPayload = buildOrdersQuery({
    ...filters,
    isExport: true,
  });

  const report = await fetchSalesReport(queryPayload);

  return exportSalesPDF({
    rows: report.data,
    summary: report.summary,
  });
};

export const exportSalesReportAsExcel = async (filters) => {
  const queryPayload = buildOrdersQuery({
    ...filters,
    isExport: true,
  });

  const report = await fetchSalesReport(queryPayload);

  return exportSalesExcel({
    rows: report.data,
    summary: report.summary,
  });
};
