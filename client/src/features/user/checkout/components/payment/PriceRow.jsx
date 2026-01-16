import PropTypes from "prop-types";

const PriceRow = ({ label, value, className }) => {
  return (
    <div className={`flex justify-between ${className || ""}`}>
      <span>{label}</span>
      <span>$ {value}</span>
    </div>
  );
};

PriceRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  className: PropTypes.string,
};

export default PriceRow;