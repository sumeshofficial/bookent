import Banner from "../../models/banner.model.js";

export const fetchBanners = async () => {
  return Banner.find({ isActive: true, isDeleted: false }).lean();
};
