import StatCard from "./StatCard";

const DashboardStats = ({ stats = {} }) => {
  const statItems = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Gross Ticket Sales", value: `$${stats.grossTicketSales?.toFixed(2) ?? "0.00"}` },
    { label: "Platform Gross Fee", value: `$${stats.platformGrossCollected?.toFixed(2) ?? "0.00"}` },
    { label: "Platform Net Revenue", value: `$${stats.platformNetRevenue?.toFixed(2) ?? "0.00"}` },
    { label: "Total Discount", value: `$${stats.totalDiscount?.toFixed(2) ?? "0.00"}` },
    { label: "Gateway Fees", value: `$${stats.totalGatewayFees?.toFixed(2) ?? "0.00"}` },
    { label: "Refunded Amount", value: `$${stats.totalRefunded?.toFixed(2) ?? "0.00"}` },
  ].filter((item) => item.value !== undefined);

  if (!Object.keys(stats).length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <div key={item.label} className="h-full">
          <StatCard {...item} />
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
