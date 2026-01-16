import PropTypes from "prop-types";

const StatCard = ({ label, value, change, isPositive }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className="text-2xl font-semibold">{value}</h2>
    </div>

    <span
      className={`text-sm font-medium ${
        isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      {change}
    </span>
  </div>
);

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  change: PropTypes.string.isRequired,
  isPositive: PropTypes.bool.isRequired,
};

export default StatCard;