import PropTypes from "prop-types";

const GrandTotal = ({ amount }) => {
  return (
    <div className="pt-4 border-t flex justify-between text-lg font-semibold">
      <span>Grand Total</span>
      <span>$ {amount}</span>
    </div>
  );
};

GrandTotal.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default GrandTotal;