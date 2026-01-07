import {
  createCoupon,
  getCoupons,
  softDeleteCoupon,
  updateCoupon,
} from "../../services/admin/coupon/coupon.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

export const createCouponController = asyncHandler(async (req, res) => {
  const coupon = await createCoupon(req.body);

  sendResponse(res, coupon, STATUS_CODE.CREATED);
});

export const getCouponsController = asyncHandler(async (req, res) => {
  const data = await getCoupons(req.query);

  sendResponse(res, data, STATUS_CODE.SUCCESS);
});

export const updateCouponController = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  const updatedCoupon = await updateCoupon({
    couponId,
    updateData: req.body,
  });

  sendResponse(res, updatedCoupon, STATUS_CODE.SUCCESS);
});

export const deleteCouponController = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  await softDeleteCoupon(couponId);

  sendResponse(
    res,
    { message: "Coupon deleted Successfully" },
    STATUS_CODE.SUCCESS
  );
});
