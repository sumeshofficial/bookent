import { exportWalletCSV, exportWalletExcel } from "../services/wallet.service";

const WalletExportActions = () => {
  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        onClick={exportWalletCSV}
        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 transition"
      >
        Export CSV
      </button>

      <button
        onClick={exportWalletExcel}
        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 transition"
      >
        Export Excel
      </button>
    </div>
  );
};

export default WalletExportActions;