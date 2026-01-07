import { countActiveBannersRepo } from "../../../repositories/admin/banner.repository.js";
import { ERRORS } from "../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../utility/constants/statusCode.js";
import { AppError } from "../../../utility/helpers.js";
import { getObjectURL } from "../../s3.service.js";

const MAX_ACTIVE_BANNERS = 5;

export const updateBannersHelper = async (banners) => {
  if (!Array.isArray(banners) || banners.length === 0) {
    return [];
  }

  const updatedBanners = await Promise.all(
    banners.map(async (banner) => {
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
    })
  );

  return updatedBanners;
};

export const bannerMaxLimitCheck = async () => {
  const activeCount = await countActiveBannersRepo();

  if (activeCount >= MAX_ACTIVE_BANNERS) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.BANNER_LIMIT_REACHED.CODE,
      `${ERRORS.BANNER_LIMIT_REACHED.MSG} Maximum allowed: ${MAX_ACTIVE_BANNERS}.`
    );
  }
};
