import { createCoupon } from "../../services/admin/coupon/coupon.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

export const createCouponController = asyncHandler(async (req, res) => {
    
  const coupon = await createCoupon(req.body);

  sendResponse(res, coupon, STATUS_CODE.CREATED);
});
