import { checkoutPageDetails } from "../../services/user/checkout/checkout.service.js";
import { applyCouopn } from "../../services/user/coupon/coupon.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

export const applyCouponController = asyncHandler(async (req, res) => {
  const { lockId, couponCode } = req.body;
  const userId = req.user._id;

  if (!lockId || !couponCode) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const { pricing } = await checkoutPageDetails(lockId, userId);

  const result = await applyCouopn(couponCode, pricing, userId);

  sendResponse(res, result, STATUS_CODE.SUCCESS);
});
