import logger from "../../config/logger.js";
import { findOrganizerById } from "../../repositories/organizer/organizer.repository.js";
import {
  rejectionTemplate,
  sendEmail,
} from "../../services/notifications/email.service.js";
import {
  getAllOrganizers,
  updateRequest,
} from "../../services/organizer.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

// Get all organizers controller
export const getOrganizersController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search?.trim() || "";
  const sort = req.query.sort || "newest";
  const status = req.query.status || "all";
  const skip = (page - 1) * limit;

  const { totalOrganizers, organizers } = await getAllOrganizers({
    limit,
    skip,
    search,
    sort,
    status,
  });

  sendResponse(
    res,
    {
      currentPage: page,
      totalPages: Math.ceil(totalOrganizers / limit),
      totalOrganizers,
      organizers,
    },
    STATUS_CODE.SUCCESS
  );
});

// Get organizer details controller
export const getOrganizersDetailsController = asyncHandler(async (req, res) => {
  const id = req.params.id;
  logger.http(`${req.method} ${req.originalUrl}`);

  if (!id) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const organizer = await findOrganizerById(id);

  if (!organizer) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.ORGANIZER_NOT_FOUND.CODE,
      ERRORS.ORGANIZER_NOT_FOUND.MSG
    );
  }

  sendResponse(res, organizer, STATUS_CODE.SUCCESS);
});

// Handle organizer request controller
export const handleOrganizerRequestController = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (status === "rejected" && !reason) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: "Reason is required when rejecting",
      });
    }

    if (!id || !status) {
      throw new AppError(
        STATUS_CODE.MISSING_FIELD,
        ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
        ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
      );
    }

    const organizer = await updateRequest({ id, status, reason });

    sendResponse(res, { message: "Organizer Updated" }, STATUS_CODE.SUCCESS);

    if (status === "rejected") {
      setImmediate(async () => {
        if (organizer?.email) {
          await sendEmail({
            to: organizer.email,
            subject: "Your Organizer Request Has Been Rejected",
            html: rejectionTemplate(organizer.fullname, reason),
          });
        }
      });
    }
  }
);
