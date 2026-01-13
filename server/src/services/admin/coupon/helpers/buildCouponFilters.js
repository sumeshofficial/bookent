export const buildCouponFilters = ({ q, status, type, date, from, to }) => {
  const filters = { isDeleted: false };

  if (q) {
    filters.$or = [
      { code: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (status === "ACTIVE") {
    filters.isActive = true;
  }
  if (status === "INACTIVE") {
    filters.isActive = false;
  }

  if (type && type !== "ALL") {
    filters.discountType = type;
  }

  const now = new Date();

  if (date === "ACTIVE") {
    filters.startDate = { $lte: now };
    filters.expiryDate = { $gte: now };
  } else if (date === "UPCOMING") {
    filters.startDate = { $gt: now };
  } else if (date === "EXPIRED") {
    filters.expiryDate = { $lt: now };
  }

  if (from) {
    filters.startDate = {
      ...(filters.startDate || {}),
      $gte: new Date(from),
    };
  }

  if (to) {
    filters.expiryDate = {
      ...(filters.expiryDate || {}),
      $lte: new Date(to),
    };
  }

  return filters;
};
