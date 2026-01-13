import logger from "../../config/logger.js";
import { checkOrganizer } from "../../services/organizer.service.js";
import { getDashboard } from "../../services/organizer/dashboard/dashboard.service.js";
import { getObjectURL } from "../../services/s3.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

// Get organizer
export const organizerDashboard = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  logger.http(`${req.method} ${req.originalUrl}`);

  if (!userId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const organizer = await checkOrganizer({ userId });

  if (organizer?.profileImage && organizer.profileImage.includes("uploads")) {
    const url = await getObjectURL(organizer.profileImage);
    organizer.profileImage = url;
  }

  sendResponse(res, organizer, STATUS_CODE.SUCCESS);
});

export const getDashboardController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const report = await getDashboard(userId, req.query);

  sendResponse(res, report, STATUS_CODE.SUCCESS);
});
