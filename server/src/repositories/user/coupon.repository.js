import Coupon from "../../models/coupons.model.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError } from "../../utility/helpers.js";

/**
 * Get a usable coupon or throw if invalid
 * @param {String} couponCode
 * @param {ClientSession} session
 * @returns {Promise<Coupon>}
 * @throws {AppError}
 */
export const getCoupon = async (couponCode, session) => {
  const coupon = await Coupon.findOne({
    code: couponCode,
    isActive: true,
    isDeleted: false,
    expiryDate: { $gt: new Date() },
  }).session(session);

  if (!coupon) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.COUPON_CANNOT_BE_USED.CODE,
      ERRORS.COUPON_CANNOT_BE_USED.MSG
    );
  }

  return coupon;
};

/**
 * update a usable coupon or throw if not updated
 * @param {String} couponId
 * @param {ClientSession} session
 * @throws {AppError}
 */
export const updateCoupon = async (couponId, session) => {
  const updatedCoupon = await Coupon.findOneAndUpdate(
    {
      _id: couponId,
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
      ],
    },
    { $inc: { usedCount: 1 } },
    { new: true, session }
  );

  if (!updatedCoupon) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.COUPON_CANNOT_BE_USED.CODE,
      ERRORS.COUPON_CANNOT_BE_USED.MSG
    );
  }
};
