import toast from "react-hot-toast";
import { adminApi } from "../../../../services/api/apiSetup";

export const getAdminWalletSummary = async () => {
  const { data } = await adminApi.get("/admin/wallet/summary");
  return data;
};

export const getAdminWalletTransactions = async (params) => {
  const { data } = await adminApi.get("/admin/wallet/transactions", { params });
  return data;
};

const downloadFile = async (url, filename) => {
  try {
    const res = await adminApi.get(url, {
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
  downloadFile("/admin/wallet/export/csv", "admin-wallet-report.csv");

export const exportWalletExcel = () =>
  downloadFile("/admin/wallet/export/excel", "admin-wallet-report.xlsx");
