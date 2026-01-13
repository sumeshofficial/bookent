import { getUserCouponUsage } from "../../../../repositories/user/couponUsage.repository.js";
import { ERRORS } from "../../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { AppError } from "../../../../utility/helpers.js";

/**
 * Validate coupon
 * @param {object} coupon
 * @param {String} userId
 */
export const validateCoupon = async (coupon, userId) => {
  if (!coupon) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.COUPON_NOTFOUND.CODE,
      ERRORS.COUPON_NOTFOUND.MSG
    );
  }

  if (coupon.isExpired) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.COUPON_EXPIRED.CODE,
      ERRORS.COUPON_EXPIRED.MSG
    );
  }

  if (!coupon.canUseCoupon()) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.COUPON_CANNOT_BE_USED.CODE,
      ERRORS.COUPON_CANNOT_BE_USED.MSG
    );
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.COUPON_CANNOT_BE_USED.CODE,
      ERRORS.COUPON_CANNOT_BE_USED.MSG
    );
  }

  const userUsage = await getUserCouponUsage(coupon._id, userId);

  if (userUsage && userUsage.usedCount >= coupon.perUserLimit) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.COUPON_USAGE_LIMIT.CODE,
      ERRORS.COUPON_USAGE_LIMIT.MSG
    );
  }
};
