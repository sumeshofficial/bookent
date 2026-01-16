import PropTypes from "prop-types";
import CouponHeader from "./CouponHeader";
import CouponInfo from "./CouponInfo";
import CouponActions from "./CouponActions";

const CouponMobileItem = ({ coupon, onEdit, onToggle, onDelete }) => {
  return (
    <div className="p-4 space-y-2 bg-white rounded-lg shadow-sm">
      <CouponHeader code={coupon.code} isActive={coupon.isActive} />

      <CouponInfo coupon={coupon} />

      <CouponActions
        coupon={coupon}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={() => onEdit(coupon)}
      />
    </div>
  );
};

CouponMobileItem.propTypes = {
  coupon: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CouponMobileItem;
