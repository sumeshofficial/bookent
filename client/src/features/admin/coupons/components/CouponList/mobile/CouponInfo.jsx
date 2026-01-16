import PropTypes from "prop-types";

const CouponInfo = ({ coupon }) => {
  return (
    <>
      <p className="text-xs text-gray-600">{coupon.description || "—"}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 pt-1">
        <div>
          <span className="text-gray-500">Discount</span>
          <p className="font-medium">
            {coupon.discountType === "PERCENTAGE"
              ? `${coupon.discountValue}%`
              : `$${coupon.discountValue}`}
          </p>
        </div>

        {coupon.discountType === "PERCENTAGE" && (
          <div>
            <span className="text-gray-500">Max Discount</span>
            <p className="font-medium">${coupon.maxDiscountAmount ?? "—"}</p>
          </div>
        )}

        <div>
          <span className="text-gray-500">Min Order</span>
          <p className="font-medium">${coupon.minOrderAmount}</p>
        </div>

        <div>
          <span className="text-gray-500">Usage</span>
          <p className="font-medium">
            {coupon.usedCount}/{coupon.usageLimit ?? "∞"}
          </p>
        </div>

        <div>
          <span className="text-gray-500">Per User</span>
          <p className="font-medium">{coupon.perUserLimit}</p>
        </div>

        <div>
          <span className="text-gray-500">Validity</span>
          <p className="font-medium">
            {new Date(coupon.startDate).toLocaleDateString()} →{" "}
            {new Date(coupon.expiryDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
};

CouponInfo.propTypes = {
  coupon: PropTypes.shape({
    description: PropTypes.string,
    discountType: PropTypes.oneOf(["PERCENTAGE", "FLAT"]).isRequired,
    discountValue: PropTypes.number.isRequired,
    maxDiscountAmount: PropTypes.number,
    minOrderAmount: PropTypes.number.isRequired,
    usedCount: PropTypes.number.isRequired,
    usageLimit: PropTypes.number,
    perUserLimit: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default CouponInfo;
