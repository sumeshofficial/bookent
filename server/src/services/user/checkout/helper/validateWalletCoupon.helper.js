import { getCoupon } from "../../../../repositories/user/coupon.repository.js";
import { getUserCouponUsage } from "../../../../repositories/user/couponUsage.repository.js";
import { ERRORS } from "../../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { AppError } from "../../../../utility/helpers.js";


export const validateWalletCoupon = async (couponCode, userId) => {
  if (!couponCode) {
    return;
  }

  const coupon = await getCoupon(couponCode);

  const userUsage = await getUserCouponUsage(coupon._id, userId);
  if (userUsage && userUsage.usedCount >= coupon.perUserLimit) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.COUPON_USAGE_LIMIT.CODE,
      ERRORS.COUPON_USAGE_LIMIT.MSG
    );
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.COUPON_CANNOT_BE_USED.CODE,
      ERRORS.COUPON_CANNOT_BE_USED.MSG
    );
  }
};
