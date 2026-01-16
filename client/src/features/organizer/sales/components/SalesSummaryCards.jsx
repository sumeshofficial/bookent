import PropTypes from "prop-types";

const Card = ({ label, value, highlight = false }) => (
  <div
    className={`bg-white shadow rounded p-4 ${
      highlight ? "border border-green-500" : ""
    }`}
  >
    <p className="text-gray-500 text-sm">{label}</p>
    <p className={`text-xl font-semibold ${highlight ? "text-green-600" : ""}`}>
      {value}
    </p>
  </div>
);

Card.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  highlight: PropTypes.bool,
};

const SalesSummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
      <Card label="Total Orders" value={summary.totalOrders} />

      <Card
        label="Gross Ticket Sales"
        value={`$${(summary.grossTicketSales ?? 0).toFixed(2)}`}
      />

      <Card
        label="Total Refunded"
        value={`$${(summary.totalRefunded ?? 0).toFixed(2)}`}
      />

      <Card
        label="Net Revenue"
        value={`$${(summary.organizerNetRevenue ?? 0).toFixed(2)}`}
        highlight
      />
    </div>
  );
};

SalesSummaryCards.propTypes = {
  summary: PropTypes.shape({
    totalOrders: PropTypes.number,
    grossTicketSales: PropTypes.number,
    totalRefunded: PropTypes.number,
    organizerNetRevenue: PropTypes.number,
  }),
};

export default SalesSummaryCards;
