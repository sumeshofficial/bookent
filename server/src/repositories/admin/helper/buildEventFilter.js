export const buildEventFilter = ({
  page = 1,
  limit = 5,
  status = "All",
  sort = "latest",
  search = "",
  startDate,
  endDate,
  category,
  priceFilter,
}) => {
  const query = {};

  if (status && status !== "All") {
    query.eventStatus = status;
  }

  if (category) {
    query.sportType = category;
  }

  if (search.trim()) {
    const regex = new RegExp(search, "i");

    query.$or = [
      { eventTitle: regex },
      { sportType: regex },
      { tags: { $in: [regex] } },
      { stadiumName: regex },
      { city: regex },
    ];
  }

  if (startDate || endDate) {
    query.matchDate = {};
    if (startDate) {
      query.matchDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.matchDate.$lte = new Date(endDate);
    }
  }

  if (priceFilter) {
    if (priceFilter === "low") {
      query.minPrice = { $lte: 5 };
    } else if (priceFilter === "medium") {
      query.minPrice = { $gte: 5, $lte: 15 };
    } else if (priceFilter === "high") {
      query.minPrice = { $gte: 15 };
    }
  }

  const sortOption = {};
  switch (sort) {
    case "price-high":
      sortOption.minPrice = -1;
      break;

    case "price-low":
      sortOption.minPrice = 1;
      break;

    case "latest":
      sortOption.createdAt = -1;
      break;

    case "oldest":
      sortOption.createdAt = 1;
      break;

    default:
      sortOption.createdAt = -1;
  }

  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 5;
  const skip = (safePage - 1) * safeLimit;

  query.isDeleted = false;

  return { query, sortOption, skip, limit: safeLimit, page };
};
