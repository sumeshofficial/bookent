import { findUserById } from "../../services/auth.service.js";
import { createOrganizer } from "../../services/organizer.service.js";
import { sendOtp } from "../../services/organizer/auth.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

// Register Organizer
export const organizerAccountRegister = asyncHandler(async (req, res) => {
  const { userId, organizationDetails, bankAccountDetails, paypalEmail } =
    req.body;

  console.log(req.body);

  if (
    !userId ||
    !paypalEmail ||
    !organizationDetails?.name ||
    !organizationDetails?.address ||
    !organizationDetails?.state
  ) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const user = await findUserById(userId);

  const organization = await createOrganizer({
    userId,
    fullname: user.fullname,
    email: user.email,
    profileImage: user.profileImage,
    paypalEmail,
    organizationDetails,
    bankAccountDetails,
  });

  sendResponse(res, organization, STATUS_CODE.CREATED);
});

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
