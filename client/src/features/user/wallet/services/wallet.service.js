import toast from "react-hot-toast";
import { api } from "../../../../services/api/apiSetup";

export const fetchWalletSummary = async () => {
  const { data } = await api.get("/user/wallet/summary");
  return data;
};

export const fetchWalletTransactions = async (params) => {
  const { data } = await api.get("/user/wallet/transactions", {
    params,
  });
  return data;
};

const downloadFile = async (url, filename) => {
  try {
    const res = await api.get(url, {
      responseType: "blob",
      withCredentials: true,
    });

    const blob = new Blob([res.data]);
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    toast.error(`Export failed ${error.message}`);
  }
};

export const exportWalletCSV = () =>
  downloadFile("/user/wallet/export/csv", "wallet-report.csv");

export const exportWalletExcel = () =>
  downloadFile("/user/wallet/export/excel", "wallet-report.xlsx");
