import { fetchEventById } from "../../repositories/user/event.repository.js";
import { ERRORS, STATUS_CODE } from "../../utility/constants.js";
import { AppError } from "../../utility/helpers.js";

export const validateEvent = async (eventId) => {
  const event = await fetchEventById(eventId);

  if (!event) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.EVENT_NOT_FOUND.CODE,
      ERRORS.EVENT_NOT_FOUND.MSG
    );
  }

  return event;
};
