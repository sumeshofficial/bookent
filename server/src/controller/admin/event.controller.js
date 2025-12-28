import { getAllEvents, getEvent } from "../../services/admin/event.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

export const getAllEventsController = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 5,
    status = "All",
    sort = "lastest",
    search = "",
    startDate,
    endDate,
    category,
    priceFilter,
  } = req.query;

  const data = await getAllEvents({
    page,
    limit,
    status,
    sort,
    search,
    startDate,
    endDate,
    category,
    priceFilter,
  });

  sendResponse(res, data, STATUS_CODE.SUCCESS);
});

export const getEventController = asyncHandler(async (req, res) => {
  const { eventSlug } = req.params;

  if (!eventSlug) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const event = await getEvent(eventSlug);

  sendResponse(res, event, STATUS_CODE.SUCCESS);
});
