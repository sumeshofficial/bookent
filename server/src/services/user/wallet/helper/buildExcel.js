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
    { key: "_id", width: 20 },
    { key: "amount", width: 15 },
    { key: "currency", width: 15 },
    { key: "paymentMethod", width: 15 },
    { key: "transaction_direction", width: 15 },
  ];

  worksheet.getRow(2).values = [
    "Date",
    "Transaction ID",
    "Amount",
    "Currency",
    "Payment Method",
    "Type",
  ];

  worksheet.getRow(2).font = { bold: true };

  data.forEach((tx) => {
    worksheet.addRow({
      createdAt: formatDate(tx.createdAt),
      _id: tx._id,
      amount: tx.amount?.value,
      currency: tx.amount?.currency,
      paymentMethod: tx.paymentMethod,
      transaction_direction: tx.display_direction,
    });
  });

  return workbook;
};
