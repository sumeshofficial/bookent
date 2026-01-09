import { updateOrganizerService } from "../../services/organizer.service.js";
import { getObjectURL } from "../../services/s3.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

export const updateOrganizerProfile = asyncHandler(async (req, res) => {
  const { id, data } = req.body;

  if (!id || !data) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const organizer = await updateOrganizerService({ id, data });

  if (!organizer) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.ORGANIZER_NOT_FOUND.CODE,
      ERRORS.ORGANIZER_NOT_FOUND.MSG
    );
  }

  if (organizer.profileImage && organizer.profileImage.includes("uploads")) {
    const url = await getObjectURL(organizer.profileImage);
    organizer.profileImage = url;
  }

  sendResponse(res, organizer, STATUS_CODE.SUCCESS);
});
