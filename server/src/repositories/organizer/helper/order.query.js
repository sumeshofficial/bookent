export const orderQueryBuilder = (eventId, filters = {}) => {
  const { page = 1, limit = 10, sort = "LATEST" } = filters;

  const query = {
    eventId,
  };

  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }

  if (filters.seatCategory) {
    query["seat.category"] = filters.seatCategory;
  }

  if (filters.search) {
    const search = filters.search.trim();

    const orConditions = [];

    if (search.match(/^[0-9a-fA-F]{24}$/)) {
      orConditions.push({ _id: search });
    }

    orConditions.push(
      { paypalOrderId: { $regex: search, $options: "i" } },
      { "seat.category": { $regex: search, $options: "i" } }
    );

    query.$or = orConditions;
  }

  const skip = (page - 1) * limit;

  const SORT_MAP = {
    LATEST: { createdAt: -1 },
    OLDEST: { createdAt: 1 },
    AMOUNT_HIGH: { "pricingBreakDown.grandTotal": -1 },
    AMOUNT_LOW: { "pricingBreakDown.grandTotal": 1 },
  };

  const sortQuery = SORT_MAP[sort] || { createdAt: -1 };

  return {
    query,
    sortQuery,
    page,
    limit,
    skip,
  };
};
