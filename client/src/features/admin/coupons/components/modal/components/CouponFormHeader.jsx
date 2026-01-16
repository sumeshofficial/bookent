import PropTypes from "prop-types";

const CouponFormHeader = ({ coupon }) => {
  return (
    <h2 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-3">
      {coupon ? "Edit Coupon" : "Create New Coupon"}
    </h2>
  );
};

CouponFormHeader.propTypes = {
  coupon: PropTypes.object,
};

CouponFormHeader.defaultProps = {
  coupon: null,
};

export default CouponFormHeader;
