import { Parser } from "json2csv";
import { formatDate } from "../../../../utility/formatDateAndTime.js";

export const buildCSV = (data) => {
  const fields = [
    { label: "Date", value: "createdAt" },
    { label: "Transaction ID", value: "_id" },
    { label: "Amount", value: "amount.value" },
    { label: "Currency", value: "amount.currency" },
    { label: "Payment Method", value: "paymentMethod" },
    { label: "Type", value: "display_direction" },
  ];

  const formattedData = data.map((tx) => ({
    ...tx,
    createdAt: formatDate(tx.createdAt),
  }));

  const parser = new Parser({ fields });
  const csv = parser.parse(formattedData);

  const title = "Bookent - Wallet Transactions";
  return `${title}\n\n${csv}`;
};
