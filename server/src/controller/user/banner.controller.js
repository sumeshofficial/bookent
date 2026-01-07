import { getBanners } from "../../services/user/banner.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

export const getBannersController = asyncHandler(async (req, res) => {
  const banners = await getBanners();

  sendResponse(res, banners, STATUS_CODE.SUCCESS);
});
