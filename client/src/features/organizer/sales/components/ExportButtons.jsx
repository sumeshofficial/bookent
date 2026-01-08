import { EXPORT_TYPES } from "../constants/sales.constants";
import { exportSalesReport } from "../services/sales.service";
import { useSearchParams } from "react-router-dom";

const ExportButtons = () => {
  const [searchParams] = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  const handleExport = async (type) => {
    const res = await exportSalesReport(type, filters);

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report.${type === "pdf" ? "pdf" : "xlsx"}`;
    a.click();
  };

  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => handleExport(EXPORT_TYPES.PDF)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Export PDF
      </button>
      <button
        onClick={() => handleExport(EXPORT_TYPES.EXCEL)}
        className="px-4 py-2 border rounded"
      >
        Export Excel
      </button>
    </div>
  );
};

export default ExportButtons;