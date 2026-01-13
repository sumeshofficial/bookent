import DashboardStats from "./components/DashboardStats";
import MonthlySalesBar from "./components/MonthlySalesBar";
import RecentOrdersTable from "./components/RecentOrdersTable";
import SalesLineChart from "./components/SalesLineChart";
import RevenuePieChart from "./components/RevenuePieChart";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import DashboardSkeleton from "./components/DashboardSkeleton";
import DashboardFilters from "./components/DashboardFilters";
import TopEventsCard from "./components/TopEventsCard";

const Dashboard = () => {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardFilters />
      <DashboardStats stats={data.stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MonthlySalesBar data={data.monthlySales} />
        <RevenuePieChart data={data.revenueSplit} />
      </div>

      <div className="grid grid-cols-1">
        <SalesLineChart data={data.statistics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopEventsCard events={data.events} />
        <RecentOrdersTable orders={data.recentOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
