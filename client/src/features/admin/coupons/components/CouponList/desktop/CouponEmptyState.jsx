const CouponEmptyState = () => {
  return (
    <tr>
      <td colSpan={6} className="py-10 text-center">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <p className="text-sm font-medium">
            No coupons found
          </p>
          <p className="text-xs">
            Try adjusting filters or create a new coupon.
          </p>
        </div>
      </td>
    </tr>
  );
};

export default CouponEmptyState;