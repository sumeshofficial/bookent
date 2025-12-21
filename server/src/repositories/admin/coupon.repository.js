import Coupon from "../../models/coupons.model.js";

export const createCouponRepo = async (payload) => {
  return Coupon.create(payload);
};

export const findCouponsRepo = async ({
  filters = {},
  sort = {},
  skip = 0,
  limit = 10,
}) => {
  return Coupon.find(filters).sort(sort).skip(skip).limit(limit).lean();
};

export const countCouponsRepo = async (filters = {}) => {
  return Coupon.countDocuments(filters);
};

export const updateCouponRepo = async ({ filter, update, options = {} }) => {
  return Coupon.findOneAndUpdate(filter, update, {
    new: true,
    ...options,
  }).lean();
};
