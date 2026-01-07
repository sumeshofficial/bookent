import ExcelJS from "exceljs";

export const exportSalesExcel = async ({ rows, summary }) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sales Report");

  const colors = {
    headerBg: "FF1E293B",
    summaryBg: "FF4338CA",
    zebraBg: "FFF8FAFC",
    border: "FFE2E8F0",
    textMain: "FF0F172A",
    textMuted: "FF64748B",
    danger: "FFBE123C",
  };

  const HEADER_TITLE = "SALES REPORT";

  sheet.getRow(1).values = [];

  sheet.getCell("A1").value = HEADER_TITLE;

  sheet.mergeCells("A1:H1");

  const titleCell = sheet.getCell("A1");
  titleCell.font = {
    size: 18,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: colors.headerBg },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  sheet.getRow(1).height = 48;

  sheet.mergeCells("A2:H2");
  const subHeader = sheet.getCell("A2");
  subHeader.value = `REPORT GENERATED: ${new Date().toLocaleString().toUpperCase()}`;
  subHeader.font = { size: 9, color: { argb: colors.textMuted }, italic: true };
  subHeader.alignment = { horizontal: "center" };
  sheet.getRow(2).height = 20;

  sheet.addRow([]);

  const summaryTitle = sheet.addRow(["EXECUTIVE SUMMARY"]);
  summaryTitle.getCell(1).font = {
    bold: true,
    color: { argb: colors.summaryBg },
  };

  const summaryFields = [
    ["Total Orders", summary.totalOrders],
    ["Gross Sales", summary.grossTicketSales],
    ["Total Discounts", summary.totalDiscount],
    ["Platform Gross", summary.platformGrossCollected],
    ["Gateway Fees", summary.totalGatewayFees],
    ["Net Revenue", summary.platformNetRevenue],
    ["Total Refunded", summary.totalRefunded || 0],
  ];

  summaryFields.forEach(([label, val]) => {
    const r = sheet.addRow([label.toUpperCase(), val]);
    r.getCell(1).font = {
      size: 8,
      bold: true,
      color: { argb: colors.textMuted },
    };
    const vCell = r.getCell(2);
    vCell.font = { size: 10, bold: true, color: { argb: colors.textMain } };
    if (typeof val === "number" && label !== "Total Orders") {
      vCell.numFmt = '"$"#,##0.00';
    }
    vCell.alignment = { horizontal: "left" };
  });

  sheet.addRow([]);

  sheet.views = [];

  sheet.columns = [
    { key: "orderId", width: 35 },
    { key: "date", width: 15 },
    { key: "grossTicketSales", width: 15 },
    { key: "discount", width: 12 },
    { key: "platformGrossFee", width: 15 },
    { key: "gatewayFee", width: 15 },
    { key: "platformNetRevenue", width: 15 },
    { key: "status", width: 15 },
  ];

  const tableHeaderRow = sheet.addRow([
    "TRANSACTION ID",
    "DATE",
    "GROSS SALES",
    "DISCOUNT",
    "PLAT. GROSS",
    "GATEWAY",
    "NET REVENUE",
    "STATUS",
  ]);

  tableHeaderRow.height = 28;

  tableHeaderRow.eachCell((cell) => {
    cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: colors.summaryBg },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  rows.forEach((row, index) => {
    const addedRow = sheet.addRow({
      orderId: row.orderId,
      date: new Date(row.createdAt).toLocaleDateString(),
      grossTicketSales: row.grossTicketSales,
      discount: row.discount,
      platformGrossFee: row.platformGrossFee,
      gatewayFee: row.gatewayFee,
      platformNetRevenue: row.platformNetRevenue,
      status: row.status,
    });

    addedRow.height = 22;

    if (index % 2 === 0) {
      addedRow.eachCell((c) => {
        c.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colors.zebraBg },
        };
      });
    }

    addedRow.eachCell((cell, colNum) => {
      cell.border = {
        bottom: { style: "thin", color: { argb: colors.border } },
      };
      if ([3, 4, 5, 6, 7].includes(colNum)) {
        cell.numFmt = '"$"#,##0.00';
        cell.alignment = { horizontal: "right" };
      }
      if (colNum === 8) {
        cell.alignment = { horizontal: "center" };
      }
    });

    if (row.platformNetRevenue < 0) {
      addedRow.getCell(7).font = { color: { argb: colors.danger }, bold: true };
    }
  });

  sheet.views = [{ state: "frozen", ySplit: tableHeaderRow.number }];

  return workbook;
};
