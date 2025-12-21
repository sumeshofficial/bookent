const CouponInfo = ({ coupon }) => {
  return (
    <>
      <p className="text-xs text-gray-600">
        {coupon.description || "—"}
      </p>

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
            <p className="font-medium">
              ${coupon.maxDiscountAmount ?? "—"}
            </p>
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

export default CouponInfo;