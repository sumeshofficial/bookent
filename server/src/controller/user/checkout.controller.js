import { checkoutPageDetails } from "../../services/user/checkout/checkout.service.js";
import { STATUS_CODE, ERRORS } from "../../utility/constants.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

export const checkoutDetailsController = asyncHandler(async (req, res) => {
  const { lockId } = req.body;
  const user = req.user;

  if (!lockId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const ticketDetails = await checkoutPageDetails(lockId, user._id);

  sendResponse(res, ticketDetails, STATUS_CODE.SUCCESS);
});
