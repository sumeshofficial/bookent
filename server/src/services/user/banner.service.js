import { fetchBanners } from "../../repositories/user/banner.repository.js";
import { updateBannersHelper } from "../admin/helper/banner.helper.js";

export const getBanners = async () => {
  const banners = await fetchBanners();

  const updatedBanners = await updateBannersHelper(banners);

  return updatedBanners;
};
