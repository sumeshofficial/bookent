import { fetchStadiumById } from "../../../../repositories/user/stadium.repository.js";
import { ERRORS } from "../../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
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
