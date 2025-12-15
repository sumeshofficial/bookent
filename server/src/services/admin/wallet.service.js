import { getAdminWallet } from "../../repositories/admin/admin.repository.js";
import {
  walletSummary,
  walletTransactions,
} from "../../repositories/admin/transaction.repository.js";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import { formatDate } from "../../utility/formatDateAndTime.js";

export const fetchWalletSummary = async () => {
  const summary = await walletSummary();
  const admin = await getAdminWallet();

  return { ...summary, balance: admin.wallet };
};

export const fetchWalletTransactions = async ({
  page = 1,
  limit = 10,
  status,
  reason,
  type,
  fromDate,
  toDate,
  sort = "latest",
}) => {
  const filters = {
    page: Number(page),
    limit: Number(limit),
    status,
    reason,
    transaction_direction: type,
    fromDate,
    toDate,
    sort,
  };

  const transactions = await walletTransactions(filters);

  return transactions;
};

export const getCSVForTransaction = async () => {
  const { data } = await walletTransactions({
    limit: 100000,
    page: 1,
    sort: "latest",
  });

  const fields = [
    { label: "Date", value: "createdAt" },
    { label: "Order ID", value: "order_id" },
    { label: "Amount", value: "amount.value" },
    { label: "Net Amount", value: "net_amount.value" },
    { label: "Currency", value: "amount.currency" },
    { label: "Payment Method", value: "paymentMethod" },
    { label: "Type", value: "transaction_direction" },
  ];

  const formattedData = data.map((tx) => ({
    ...tx,
    createdAt: formatDate(tx.createdAt),
  }));

  const parser = new Parser({ fields });
  const csv = parser.parse(formattedData);

  const title = "Bookent - Admin Wallet Transactions";
  return `${title}\n\n${csv}`;
};

export const getExcelForTransaction = async () => {
  const { data } = await walletTransactions({
    limit: 100000,
    page: 1,
    sort: "latest",
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Admin Wallet Transactions Report");

  worksheet.mergeCells("A1:G1");
  worksheet.getCell("A1").value = "Bookent - Admin Wallet Transactions";
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
      transaction_direction: tx.transaction_direction,
    });
  });

  return workbook;
};
