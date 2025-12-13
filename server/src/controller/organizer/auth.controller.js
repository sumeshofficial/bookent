import logger from "../../config/logger.js";
import { findUserById } from "../../services/auth.service.js";
import { createOrganizer } from "../../services/organizer.service.js";
import { sendOtp } from "../../services/organizer/auth.service.js";
import { STATUS_CODE, statusCode } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

// Register Organizer
export const organizerAccountRegister = async (req, res) => {
  const { userId, organizationDetails, bankAccountDetails } = req.body;
  try {
    if (
      !userId ||
      !organizationDetails?.name ||
      !organizationDetails?.address ||
      !organizationDetails?.state ||
      !bankAccountDetails?.accountNumber
    ) {
      return res.status(statusCode.missingField).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = findUserById(userId);

    const organization = await createOrganizer({
      userId,
      fullname: user.fullname,
      email: user.email,
      profileImage: user.profileImage,
      organizationDetails,
      bankAccountDetails,
    });

    return res.status(statusCode.created).json({
      success: true,
      message: "Organizer registered successfully",
      data: organization,
    });
  } catch (error) {
    logger.error(`Error create organizer ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message || "Something went wrong" });
  }
};

// Send otp
export const sendOtpController = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
    userId: req.user._id,
  };
  const email = await sendOtp(data);

  sendResponse(
    res,
    { message: `OTP sent successfully to ${email}` },
    STATUS_CODE.CREATED
  );
});