import { useQuery } from "@tanstack/react-query";
import { fetchSalesReport } from "../services/sales.service";
import { useSearchParams } from "react-router-dom";

export const useSalesReport = () => {
  const [searchParams] = useSearchParams();

  const filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    sort: searchParams.get("sort") || "latest",
    preset: searchParams.get("preset") || "month",
    fromDate: searchParams.get("fromDate") || undefined,
    toDate: searchParams.get("toDate") || undefined,
    year: searchParams.get("year") || undefined,
  };

  return useQuery({
    queryKey: ["sales-report", filters],
    queryFn: () => fetchSalesReport(filters),
    keepPreviousData: true,
  });
};
