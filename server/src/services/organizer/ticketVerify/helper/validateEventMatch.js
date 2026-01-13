import { ERRORS } from "../../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { AppError } from "../../../../utility/helpers.js";

export const validateEventMatch = ({ qrEventId, eventId }) => {
  if (qrEventId !== eventId) {
    throw new AppError(
      STATUS_CODE.FORBIDDEN,
      ERRORS.EVENT_MISMATCH.CODE,
      ERRORS.EVENT_MISMATCH.MSG
    );
  }
};
