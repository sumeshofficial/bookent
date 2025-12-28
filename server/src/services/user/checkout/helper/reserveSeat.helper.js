import { reserveTicket } from "../../../../repositories/user/event.repository.js";
import { ERRORS } from "../../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { AppError } from "../../../../utility/helpers.js";

export const reserveSeatOrFail = async ({ event, section, session }) => {
  const result = await reserveTicket({ event, section, session });

  if (result.modifiedCount === 0) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.SEATS_NOT_AVAILABLE.CODE,
      ERRORS.SEATS_NOT_AVAILABLE.MSG
    );
  }
};