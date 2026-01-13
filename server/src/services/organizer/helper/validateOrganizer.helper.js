import { checkOrganizerWithUserId } from "../../../repositories/organizer/stadium.repository.js";
import { ERRORS } from "../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../utility/constants/statusCode.js";
import { AppError } from "../../../utility/helpers.js";

export const validateOrganizer = async (userId) => {
  const organizer = await checkOrganizerWithUserId(userId);

  if (!organizer) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.ORGANIZER_NOT_FOUND.CODE,
      ERRORS.ORGANIZER_NOT_FOUND.MSG
    );
  }

  return organizer;
};
