import { getAdminDashboard } from "../../services/admin/dashboard/dashboard.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

export const getAdminDashboardController = asyncHandler(async (req, res) => {
  const data = await getAdminDashboard(req.query);

  sendResponse(res, data, STATUS_CODE.SUCCESS);
});
