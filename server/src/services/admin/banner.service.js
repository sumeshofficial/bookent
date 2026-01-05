import {
  countActiveBannersRepo,
  createBannerRepo,
  deleteBannerRepo,
  fetchBanners,
  updateBannerRepo,
} from "../../repositories/admin/banner.repository.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError } from "../../utility/helpers.js";
import { updateBannersHelper } from "./helper/banner.helper.js";

const MAX_ACTIVE_BANNERS = 5;

export const createBanner = async (payload) => {
  if (payload.isActive === true) {
    const activeCount = await countActiveBannersRepo();

    if (activeCount >= MAX_ACTIVE_BANNERS) {
      throw new AppError(
        STATUS_CODE.BAD_REQUEST,
        ERRORS.BANNER_LIMIT_REACHED.CODE,
        `${ERRORS.BANNER_LIMIT_REACHED.MSG} Maximum allowed: ${MAX_ACTIVE_BANNERS}.`
      );
    }
  }

  const banner = await createBannerRepo(payload);

  return banner;
};

export const updateBanner = async (bannerId, newData) => {
  const updatedBanner = await updateBannerRepo(bannerId, newData);

  if (!updatedBanner) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.BANNER_NOT_FOUND.CODE,
      ERRORS.BANNER_NOT_FOUND.MSG
    );
  }

  return updatedBanner;
};

export const getBanners = async ({
  page = 1,
  limit = 10,
  isActive,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const data = await fetchBanners({
    page,
    limit,
    isActive,
    search,
    sortBy,
    sortOrder,
  });

  const banners = await updateBannersHelper(data.data);

  return {
    data: banners,
    meta: data.meta,
  };
};

export const deleteBanner = async (bannerId) => {
  const result = await deleteBannerRepo(bannerId);

  if (result.matchedCount === 0) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.BANNER_NOT_FOUND.CODE,
      ERRORS.BANNER_NOT_FOUND.MSG
    );
  }

  return true;
};
