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

        {coupon.discountType === "PERCENTAGE" &&
          coupon.maxDiscountAmount && (
            <p className="text-xs text-gray-500">
              Max ${coupon.maxDiscountAmount}
            </p>
          )}
      </td>

      <td className="p-3 text-center">
        {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
        <p className="text-xs text-gray-500">
          Per user: {coupon.perUserLimit}
        </p>
      </td>

      <td className="p-3 text-center text-xs">
        <p>{formatDate(coupon.startDate)}</p>
        <span className="text-gray-400">→</span>
        <p>{formatDate(coupon.expiryDate)}</p>
      </td>
    </>
  );
};

export default CouponInfoCell;