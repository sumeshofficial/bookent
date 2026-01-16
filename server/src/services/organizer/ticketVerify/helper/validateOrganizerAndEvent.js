import { findEventByOrganizerIdAndEventId } from "../../../../repositories/organizer/event.repository.js";
import { checkOrganizer } from "../../../../repositories/organizer/organizer.repository.js";
import { ERRORS } from "../../../../utility/constants/constants.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { AppError } from "../../../../utility/helpers.js";

export const validateOrganizerAndEvent = async ({ userId, eventId }) => {
  const organizer = await checkOrganizer({ userId });

  if (!organizer) {
    throw new AppError(
      STATUS_CODE.PERMISSION_DENIED,
      ERRORS.ORGANIZER_NOT_FOUND.CODE,
      ERRORS.ORGANIZER_NOT_FOUND.MSG
    );
  }

  const event = await findEventByOrganizerIdAndEventId(organizer._id, eventId);

  if (!event) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.EVENT_NOT_FOUND.CODE,
      ERRORS.EVENT_NOT_FOUND.MSG
    );
  }

  return event;
};
