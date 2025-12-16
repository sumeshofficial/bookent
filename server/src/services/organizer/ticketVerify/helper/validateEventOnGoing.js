import { ERRORS } from "../../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { AppError } from "../../../../utility/helpers.js";

export const validateEventOngoing = (event) => {
  if (!event) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.EVENT_NOT_FOUND.CODE,
      ERRORS.EVENT_NOT_FOUND.MSG
    );
  }

  if (!event.matchDate || !event.matchTime || !event.matchDuration) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.EVENT_INVALID.CODE,
      ERRORS.EVENT_INVALID.MSG
    );
  }

  const now = new Date();
  const eventStart = new Date(event.matchDate);

  const [hours, minutes] = event.matchTime.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.EVENT_INVALID.CODE,
      ERRORS.EVENT_INVALID.MSG
    );
  }

  eventStart.setHours(hours, minutes, 0, 0);

  const eventEnd = new Date(
    eventStart.getTime() + Number(event.matchDuration) * 60 * 1000
  );

  // Allow to verify ongoing events

  //   if (now < eventStart) {
  //     throw new AppError(
  //       STATUS_CODE.FORBIDDEN,
  //       ERRORS.EVENT_NOT_ONGOING.CODE,
  //       ERRORS.EVENT_NOT_ONGOING.MSG
  //     );
  //   }

  if (now > eventEnd) {
    throw new AppError(
      STATUS_CODE.FORBIDDEN,
      ERRORS.EVENT_NOT_ONGOING.CODE,
      ERRORS.EVENT_NOT_ONGOING.MSG
    );
  }
};
