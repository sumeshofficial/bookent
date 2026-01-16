import ActiveToggle from "./ActiveToggle";
import PropTypes from "prop-types";

const CouponStatusSection = ({ isActive, setValue }) => {
  return (
    <ActiveToggle
      checked={isActive}
      onChange={(e) => setValue("isActive", e.target.checked)}
    />
  );
};

CouponStatusSection.propTypes = {
  isActive: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default CouponStatusSection;
