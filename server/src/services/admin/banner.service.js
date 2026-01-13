import {
  createBannerRepo,
  deleteBannerRepo,
  fetchBanner,
  fetchBanners,
  updateBannerRepo,
} from "../../repositories/admin/banner.repository.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError } from "../../utility/helpers.js";
import { deleteObject, getObjectURL } from "../s3.service.js";
import {
  bannerMaxLimitCheck,
  updateBannersHelper,
} from "./helper/banner.helper.js";

export const createBanner = async (payload) => {
  if (payload.isActive === true) {
    await bannerMaxLimitCheck();
  }

  const banner = await createBannerRepo(payload);

  let image = banner.image;
  let mobileImage = banner.mobileImage;

  if (banner.image) {
    image = await getObjectURL(banner.image);
  }

  if (banner.mobileImage) {
    mobileImage = await getObjectURL(banner.mobileImage);
  }

  return {
    ...banner,
    image,
    mobileImage,
  };
};

export const updateBanner = async (bannerId, newData) => {
  if (newData.isActive === true) {
    await bannerMaxLimitCheck();
  }

  const banner = await fetchBanner(bannerId);

  if (newData?.image) {
    await deleteObject(banner.image);
  }

  if (newData?.mobileImage) {
    if (banner?.mobileImage) {
      await deleteObject(banner.mobileImage);
    }
  }

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
