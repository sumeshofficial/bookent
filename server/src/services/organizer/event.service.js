import Event from "../../models/event.model.js";
import { createEvent } from "../../repositories/organizer/event.repository.js";
import {
  deleteRedisData,
  storeInRedis,
} from "../../repositories/redis/redis.repository.js";
import { ERRORS, STATUS_CODE } from "../../utility/constants.js";
import { isSlugExists } from "../../utility/event.utils.js";
import { AppError } from "../../utility/helpers.js";
import { getRedisData } from "../redis.service.js";

export const finishCreateEvent = async (body) => {
  const { sessionId, bannerImageKey, thumbnailImageKey } = body;

  const cached = await getRedisData(sessionId);

  if (!cached) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.VALIDATION_EXPIRED.CODE,
      ERRORS.VALIDATION_EXPIRED.MSG
    );
  }

  const data = JSON.parse(cached);

  const slug = await isSlugExists(Event, data.eventTitle);

  const newEvent = {
    ...data,
    bannerImageKey,
    thumbnailImageKey,
    slug,
  };

  const event = await createEvent(newEvent);

  if (event.ticketSetup && event.ticketSetup.length > 0) {
    for (const section of event.ticketSetup) {
      const redisKey = `inventory:${event._id}:${section.sectionId}`;
      await storeInRedis(redisKey, section.availableTickets);
    }
  }

  await deleteRedisData(sessionId);

  return event;
};
