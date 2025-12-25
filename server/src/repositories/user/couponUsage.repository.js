import CouponUsage from "../../models/couponUsage.model.js";

/**
 * get couponUsage
 * @param {String} couponId
 * @param {String} userId
 * @param {ClientSession} session
 * @returns {Promise<CouponUsage|null>}
 */
export const getUserCouponUsage = async (couponId, userId, session) => {
  return CouponUsage.findOne({
    couponId,
    userId,
  }).session(session);
};

/**
 * update couponUsage
 * @param {String} couponId
 * @param {String} userId
 * @param {ClientSession} session
 * @returns {Promise<CouponUsage|null>}
 */
export const updateCouponUsage = async (couponId, userId, session) => {
  return CouponUsage.findOneAndUpdate(
    { couponId, userId },
    { $inc: { usedCount: 1 } },
    { upsert: true, session }
  );
};
