import SalesFilters from "./components/SalesFilters";
import SalesSummaryCards from "./components/SalesSummaryCards";
import SalesTable from "./components/SalesTable";
import ExportButtons from "./components/ExportButtons";
import { useSalesReport } from "./hooks/useSalesReport";
import Pagination from "../../../sharedComponents/Pagination";
import SalesSkeleton from "./components/SalesSkeleton";

const SalesReport = () => {
  const { data, isLoading } = useSalesReport();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Sales Report</h1>

      <SalesFilters />
      {isLoading ? (
        <SalesSkeleton />
      ) : (
        <>
          <ExportButtons />
          <SalesSummaryCards summary={data?.summary} />
          <SalesTable data={data?.data} />
          <Pagination meta={data.meta} />
        </>
      )}
    </div>
  );
};

export default SalesReport;
