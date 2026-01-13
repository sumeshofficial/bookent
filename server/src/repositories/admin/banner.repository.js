import Banner from "../../models/banner.model.js";
import { buildBannerFilters } from "./helper/buildBannerQuery.js";

export const createBannerRepo = async (data) => {
  return Banner.create(data);
};

export const updateBannerRepo = async (bannerId, newData) => {
  return Banner.findOneAndUpdate(
    {
      _id: bannerId,
      isDeleted: false,
    },
    {
      $set: newData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const fetchBanner = async (bannerId) => {
  return Banner.findOne({
    _id: bannerId,
    isDeleted: false,
  }).lean();
};

export const fetchBanners = async ({
  page = 1,
  limit = 10,
  isActive,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const { query, sort, skip } = buildBannerFilters({
    page,
    limit,
    isActive,
    search,
    sortBy,
    sortOrder,
  });

  const [banners, total] = await Promise.all([
    Banner.find(query).sort(sort).skip(skip).limit(limit).lean(),

    Banner.countDocuments(query),
  ]);

  return {
    data: banners,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const deleteBannerRepo = async (bannerId) => {
  return Banner.updateOne(
    {
      _id: bannerId,
      isDeleted: false,
    },
    {
      isDeleted: true,
      deletedAt: new Date(),
    }
  );
};

export const countActiveBannersRepo = async () => {
  return Banner.countDocuments({
    isDeleted: false,
    isActive: true,
  });
};
