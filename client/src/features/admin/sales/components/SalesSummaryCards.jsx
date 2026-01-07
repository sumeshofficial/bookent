const Card = ({ label, value, highlight = false }) => (
  <div
    className={`bg-white shadow rounded p-4 ${
      highlight ? "border border-green-500" : ""
    }`}
  >
    <p className="text-gray-500 text-sm">{label}</p>
    <p
      className={`text-xl font-semibold ${
        highlight ? "text-green-600" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

const SalesSummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
      <Card
        label="Total Orders"
        value={summary.totalOrders}
      />

      <Card
        label="Gross Ticket Sales"
        value={`$${(summary.grossTicketSales ?? 0).toFixed(2)}`}
      />

      <Card
        label="Total Discount"
        value={`-$${(summary.totalDiscount ?? 0).toFixed(2)}`}
      />

      <Card
        label="User Refunds Issued"
        value={`-$${(summary.totalRefunded ?? 0).toFixed(2)}`}
      />

      <Card
        label="Platform Fee"
        value={`$${(summary.platformGrossCollected ?? 0).toFixed(2)}`}
      />

      <Card
        label="Net Platform Revenue"
        value={`$${(summary.platformNetRevenue ?? 0).toFixed(2)}`}
        highlight
      />
    </div>
  );
};

export default SalesSummaryCards;