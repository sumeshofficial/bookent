import { checkPageDetails } from "../../services/user/checkout.service";
import { STATUS_CODE } from "../../utility/constants";
import { AppError, asyncHandler } from "../../utility/helpers";

export const checkoutDetails = asyncHandler(async (req, res) => {
  const { lockId } = req.body;
  const user = req.user;

  if (!lockId) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "ALL_FIELDS_ARE_REQUIRED",
      "lockIdrequired."
    );
  }

  const ticketDetails = await checkPageDetails(lockId, user._id);
});
