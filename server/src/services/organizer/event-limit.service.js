import { countEventsByOrganizerForDate } from "../../repositories/organizer/event.repository.js";
import { AppError } from "../../utility/helpers.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";

export const validateDailyEventLimit = async (organizerId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const count = await countEventsByOrganizerForDate({
    organizerId,
    startDate: startOfDay,
    endDate: endOfDay,
  });

  if (count >= 2) {
    throw new AppError(
      STATUS_CODE.PERMISSION_DENIED,
      ERRORS.DAILY_EVENT_LIMIT_REACHED.CODE,
      ERRORS.DAILY_EVENT_LIMIT_REACHED.MSG
    );
  }
};
