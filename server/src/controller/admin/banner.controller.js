import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "../../services/admin/banner.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

export const getBannersController = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    isActive,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const data = await getBanners({
    page,
    limit,
    isActive,
    search,
    sortBy,
    sortOrder,
  });

  sendResponse(res, data, STATUS_CODE.SUCCESS);
});

export const createBannerController = asyncHandler(async (req, res) => {
  const payload = req.body;

  const banner = await createBanner(payload);

  sendResponse(res, banner, STATUS_CODE.CREATED);
});

export const updateBannerController = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;
  const newData = req.body;

  if (!bannerId || !newData) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const banner = await updateBanner(bannerId, newData);

  sendResponse(res, banner, STATUS_CODE.SUCCESS);
});

export const deleteBannerController = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;

  if (!bannerId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  await deleteBanner(bannerId);

  sendResponse(
    res,
    { message: "Banner deleted successfully" },
    STATUS_CODE.SUCCESS
  );
});
