import { findStadiumWithId } from "../../../../repositories/organizer/stadium.repository.js";
import { ERRORS, STATUS_CODE } from "../../../../utility/constants.js";
import { AppError } from "../../../../utility/helpers.js";

export const validateStadium = async (organizerId, stadiumId) => {
  const stadium = await findStadiumWithId(organizerId, stadiumId);

  if (!stadium) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.STADIUM_NOT_FOUND.CODE,
      ERRORS.STADIUM_NOT_FOUND.MSG
    );
  }

  return stadium;
};
