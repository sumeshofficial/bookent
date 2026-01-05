import { getObjectURL } from "../../s3.service.js";

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
