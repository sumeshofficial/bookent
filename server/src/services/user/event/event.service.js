import { ENV } from "../../../config/env.conf.js";
import { findEventsRepo } from "../../../repositories/user/event.repository.js";
import { isEventValid } from "../../../utility/eventDateHelpers.js";
import { getObjectURL } from "../../s3.service.js";
import {
  filterCity,
  filterLive,
  filterRecommended,
  filterTrending,
} from "./helper/event.filters.js";
import dotenv from "dotenv";
dotenv.config();

export const getHomeEventsService = async (city) => {
  const events = await findEventsRepo();

  const updatedEvents = await Promise.all(
    events.map(async (event) => {
      const bannerImage = await getObjectURL(event.bannerImageKey);
      const thumbnailImage = await getObjectURL(event.thumbnailImageKey);

      return {
        ...event,
        bannerImage,
        thumbnailImage,
      };
    })
  );

  const now = new Date();
  const blockHours = Number(ENV.BOOKING_BLOCK_HOURS || 4);
  const fourHours = blockHours * 60 * 60 * 1000;

  const validEvents = updatedEvents.filter((event) =>
    isEventValid(event, now, fourHours)
  );

  return {
    recommendedEvents: filterRecommended(validEvents, now),
    trendingEvents: filterTrending(validEvents),
    liveEvents: filterLive(validEvents),
    popularInYourCity: filterCity(validEvents, city),
  };
};
