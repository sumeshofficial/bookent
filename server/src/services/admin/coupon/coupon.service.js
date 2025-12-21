import {
  countCouponsRepo,
  createCouponRepo,
  findCouponsRepo,
  updateCouponRepo,
} from "../../../repositories/admin/coupon.repository.js";
import { ERRORS } from "../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../utility/constants/statusCode.js";
import { AppError } from "../../../utility/helpers.js";
import { buildCoupon } from "./helpers/buildCoupon.js";
import { buildCouponFilters } from "./helpers/buildCouponFilters.js";
import { buildCouponSort } from "./helpers/buildCouponSort.js";
import { buildPagination } from "./helpers/buildPagination.js";

export const createCoupon = async (payload) => {
  const coupon = await createCouponRepo(payload);

  const updatedCoupon = buildCoupon(coupon);

  return updatedCoupon;
};

export const getCoupons = async (query) => {
  const { page, limit, q, status, type, date, sort, from, to } = query;

  const filters = buildCouponFilters({
    q,
    status,
    type,
    date,
    from,
    to,
  });

  const sortQuery = buildCouponSort(sort);
  const {
    skip,
    limit: pageLimit,
    page: currentPage,
  } = buildPagination({ page, limit });

  const [data, total] = await Promise.all([
    findCouponsRepo({
      filters,
      sort: sortQuery,
      skip,
      limit: pageLimit,
    }),
    countCouponsRepo(filters),
  ]);

  return {
    coupons: data.map(buildCoupon),
    meta: {
      page: currentPage,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit),
      totalItems: total,
    },
  };
};

export const updateCoupon = async ({ couponId, updateData }) => {
  const coupon = await updateCouponRepo({
    filter: { _id: couponId, isDeleted: false },
    update: { $set: updateData },
  });

  if (!coupon) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.COUPON_NOTFOUND.CODE,
      ERRORS.COUPON_NOTFOUND.MSG
    );
  }

  return buildCoupon(coupon);
};

export const softDeleteCoupon = async (couponId) => {
  await updateCouponRepo({
    filter: { _id: couponId, isDeleted: false },
    update: {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        isActive: false,
      },
    },
  });
};
