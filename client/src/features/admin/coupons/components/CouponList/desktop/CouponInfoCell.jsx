import PropTypes from "prop-types";
import { formatDate } from "../../../../../../utils/constants";

const CouponInfoCell = ({ coupon }) => {
  return (
    <>
      <td className="p-3">
        <p className="font-semibold">{coupon.code}</p>
        {coupon.description && (
          <p className="text-xs text-gray-500">{coupon.description}</p>
        )}
      </td>

      <td className="p-3">
        <p className="font-medium">
          {coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}% OFF`
            : `$${coupon.discountValue} OFF`}
        </p>

        {coupon.discountType === "PERCENTAGE" && coupon.maxDiscountAmount && (
          <p className="text-xs text-gray-500">
            Max ${coupon.maxDiscountAmount}
          </p>
        )}
      </td>

      <td className="p-3 text-center">
        {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
        <p className="text-xs text-gray-500">Per user: {coupon.perUserLimit}</p>
      </td>

      <td className="p-3 text-center text-xs">
        <p>{formatDate(coupon.startDate)}</p>
        <span className="text-gray-400">→</span>
        <p>{formatDate(coupon.expiryDate)}</p>
      </td>
    </>
  );
};

CouponInfoCell.propTypes = {
  coupon: PropTypes.shape({
    code: PropTypes.string.isRequired,
    description: PropTypes.string,
    discountType: PropTypes.string.isRequired,
    discountValue: PropTypes.number.isRequired,
    maxDiscountAmount: PropTypes.number,
    usedCount: PropTypes.number.isRequired,
    usageLimit: PropTypes.number,
    perUserLimit: PropTypes.number.isRequired,
    startDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
    expiryDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
  }).isRequired,
};

export default CouponInfoCell;
