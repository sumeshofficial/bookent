import logger from "../../config/logger.js";
import { findOrganizerById } from "../../services/auth.service.js";
import {
  rejectionTemplate,
  sendEmail,
} from "../../services/notifications/email.service.js";
import {
  getAllOrganizers,
  updateRequest,
} from "../../services/organizer.service.js";
import { STATUS_CODE, statusCode } from "../../utility/constants/statusCode.js";

// Get all organizers controller
export const getOrganizersController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const sort = req.query.sort || "newest";
    const status = req.query.status || "all";
    const skip = (page - 1) * limit;

    logger.http(
      `GET /api/admin/organizers?page=${page}&limit=${limit}&search=${search}&sort=${sort}&status=${status}`
    );

    logger.info(
      `Fetching organizers: page=${page}, limit=${limit}, filter=${status}, status=${status}`
    );

    const { totalOrganizers, organizers } = await getAllOrganizers({
      limit,
      skip,
      search,
      sort,
      status,
    });

    if (!organizers.length) {
      logger.warn("No organizers found for given filters");
    } else {
      logger.info(
        `Fetched ${organizers.length} organizers out of ${totalOrganizers} total`
      );
    }

    res.status(statusCode.success).json({
      success: true,
      message: "Organizers fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalOrganizers / limit),
      totalOrganizers,
      organizers,
    });
  } catch (error) {
    logger.error(`Error fetching organizers: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
      success: false,
      error: "Failed to fetch organizers. Please try again later.",
    });
  }
};

// Get organizer details controller
export const getOrganizersDetailsController = async (req, res) => {
  const id = req.params.id;
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!id) {
      logger.warn("Missing required field: organizerId not provided");
      return res
        .status(statusCode.missingField)
        .json({ success: false, error: "Missing field" });
    }

    logger.info(`Fetching organizer details for organizerId=${id}`);
    const organizer = await findOrganizerById(id);

    if (!organizer) {
      logger.warn(`Organizer not found for ID=${id}`);
      return res
        .status(statusCode.notFound)
        .json({ success: false, error: "Organizer not found" });
    }

    logger.info(
      `User fetched successfully: ID=${organizer._id} UserId=${organizer.userId} OrganizationName=${organizer.organizationDetails.name}`
    );
    return res.status(statusCode.success).json({
      success: true,
      message: "Organizer fetch successfully",
      organizer,
    });
  } catch (error) {
    logger.error(`Error fetching organizer: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Something went wrong" });
  }
};

// Handle organizer request controller
export const handleOrganizerRequestController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (status === "rejected" && !reason) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: "Reason is required when rejecting",
      });
    }

    if (!id || !status) {
      logger.warn(`Missing required fields: id=${id}, status=${status}`);
      return res
        .status(statusCode.missingField)
        .json({ success: false, error: "Missing field" });
    }

    const organizer = await updateRequest({ id, status, reason });

    res.status(statusCode.success).json({ message: "Organizer Updated" });

    if (status === "rejected") {
      setImmediate(async () => {
        await sendEmail({
          to: organizer.email,
          subject: "Your Organizer Request Has Been Rejected",
          html: rejectionTemplate(organizer.fullname, reason),
        });
      });
    }
  } catch (error) {
    logger.error(
      `Error updating organizer request: ${error.stack || error.message}`
    );
    res.status(statusCode.serverError).json({
      error: "Something went wrong",
    });
  }
};
