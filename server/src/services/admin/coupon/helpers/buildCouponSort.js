export const buildCouponSort = (sort) => {
  switch (sort) {
    case "EXPIRY":
      return { expiryDate: 1 };
    case "USAGE":
      return { usedCount: -1 };
    default:
      return { createdAt: -1 };
  }
};
