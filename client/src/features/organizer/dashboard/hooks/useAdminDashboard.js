import { useQuery } from "@tanstack/react-query";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { fetchAdminDashboard } from "../services/dashboard.service";

export const useAdminDashboard = () => {
  const { filters } = useDashboardFilters();

  return useQuery({
    queryKey: ["admin-dashboard", filters],
    queryFn: () => fetchAdminDashboard(filters),
    keepPreviousData: true,
  });
};