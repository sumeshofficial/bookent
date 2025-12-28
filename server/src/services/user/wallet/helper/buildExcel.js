import ExcelJS from "exceljs";
import { formatDate } from "../../../../utility/formatDateAndTime.js";

export const buildExcel = (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Wallet Transactions Report");

  worksheet.mergeCells("A1:G1");
  worksheet.getCell("A1").value = "Bookent - Wallet Transactions";
  worksheet.getCell("A1").font = { bold: true, size: 14 };
  worksheet.getCell("A1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.columns = [
    { key: "createdAt", width: 20 },
    { key: "order_id", width: 25 },
    { key: "amount", width: 15 },
    { key: "net_amount", width: 15 },
    { key: "currency", width: 10 },
    { key: "paymentMethod", width: 15 },
    { key: "transaction_direction", width: 15 },
  ];

  worksheet.getRow(2).values = [
    "Date",
    "Order ID",
    "Amount",
    "Net Amount",
    "Currency",
    "Payment Method",
    "Type",
  ];

  worksheet.getRow(2).font = { bold: true };

  data.forEach((tx) => {
    worksheet.addRow({
      createdAt: formatDate(tx.createdAt),
      order_id: tx.order_id,
      amount: tx.amount?.value,
      net_amount: tx.net_amount?.value,
      currency: tx.amount?.currency,
      paymentMethod: tx.paymentMethod,
      transaction_direction: tx.display_direction,
    });
  });

  return workbook;
};
