export const buildCoupon = async (data) => {
  const coupon = {
    code: data.code,
    description: data.description,
    discountType: data.discountType,
    discountValue: data.discountValue,
    startDate: data.startDate,
    expiryDate: data.expiryDate,
    isActive: data.isActive,
    maxDiscountAmount: data?.maxDiscountAmount,
    minOrderAmount: data.minOrderAmount,
    perUserLimit: data.perUserLimit,
    usageLimit: data.usageLimit,
    usedCount: data.usedCount,
  };

  return coupon;
};
