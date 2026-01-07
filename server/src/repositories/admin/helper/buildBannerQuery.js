export const buildBannerFilters = ({
  isActive,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  page,
  limit,
}) => {
  const query = {
    isDeleted: false,
  };

  if (isActive === "true") {
    query.isActive = true;
  } else if (isActive === "false") {
    query.isActive = false;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { subtitle: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const sort = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  return { query, sort, skip };
};
