import logger from "../../config/logger.js";
import { checkOrganizer } from "../../services/organizer.service.js";
import { getDashboard } from "../../services/organizer/dashboard/dashboard.service.js";
import { getObjectURL } from "../../services/s3.service.js";
import { STATUS_CODE, statusCode } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

// Get organizer
export const organizerDashboard = async (req, res) => {
  const userId = req.params.id;
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!userId) {
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Missing Field",
      });
    }

    const organizer = await checkOrganizer({ userId });

    if (organizer.profileImage && organizer.profileImage.includes("uploads")) {
      const url = await getObjectURL(organizer.profileImage);
      organizer.profileImage = url;
    }

    return res.status(statusCode.success).json({
      success: true,
      message: "Chceking Succesfully",
      organizer,
    });
  } catch (error) {
    res.status(statusCode.serverError).json({
      success: false,
      error: error.message || "Something went worng",
    });
  }
};

export const getDashboardController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const report = await getDashboard(userId, req.query);

  sendResponse(res, report, STATUS_CODE.SUCCESS);
});
