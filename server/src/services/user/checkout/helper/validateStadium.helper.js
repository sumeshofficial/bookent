import { fetchStadiumById } from "../../../../repositories/user/stadium.repository.js";
import { ERRORS, STATUS_CODE } from "../../../../utility/constants.js";
import { AppError } from "../../../../utility/helpers.js";

export const validateStadium = async (stadiumId) => {
  const stadium = await fetchStadiumById(stadiumId);

  if (!stadium) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.STADIUM_NOT_FOUND.CODE,
      ERRORS.STADIUM_NOT_FOUND.MSG
    );
  }

  return stadium;
};
