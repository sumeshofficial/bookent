import logger from "../../config/logger.js";
import { getObjectURL } from "../../services/s3.service.js";
import {
  findEventsForUser,
} from "../../services/user.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { getHomeEventsService } from "../../services/user/event/event.service.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";
import { validateEventAvailability } from "../../utility/helpers.js";
import { checkOrganizer } from "../../repositories/organizer/organizer.repository.js";
import { getEventBookings } from "../../services/organizer/event.service.js";
import { filterAndSortService } from "../../repositories/user/event.repository.js";
import { eventDetails } from "../../repositories/admin/event.repository.js";

// Home Page Events List controller
export const getHomeEventSectionsController = asyncHandler(async (req, res) => {
  const city = req.user?.preferences?.venue;

  const sections = await getHomeEventsService(city);

  sendResponse(res, sections, STATUS_CODE.SUCCESS);
});

export const filterAndSortEventsController = async (req, res) => {
  try {
    const { date, category, price, sort, page = 1, homeCategory } = req.query;
    const user = req.user;

    const query = { eventStatus: "Published" };

    if (date) {
      const now = new Date();

      const startOfDay = (d) => {
        const x = new Date(d);
        x.setHours(0, 0, 0, 0);
        return x;
      };

      const endOfDay = (d) => {
        const x = new Date(d);
        x.setHours(23, 59, 59, 999);
        return x;
      };

      const normalized = date.toLowerCase();

      switch (normalized) {
        case "today": {
          query.matchDate = { $gte: startOfDay(now), $lte: endOfDay(now) };
          break;
        }
        case "tomorrow": {
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          query.matchDate = {
            $gte: startOfDay(tomorrow),
            $lte: endOfDay(tomorrow),
          };
          break;
        }
        case "this-week": {
          const weekStart = startOfDay(now);
          const weekEnd = new Date(now);
          const day = now.getDay();

          const daysLeft = 7 - day;
          weekEnd.setDate(weekEnd.getDate() + daysLeft);

          query.matchDate = { $gte: weekStart, $lte: endOfDay(weekEnd) };
          break;
        }
        case "this-month": {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          query.matchDate = {
            $gte: startOfDay(monthStart),
            $lte: endOfDay(monthEnd),
          };
          break;
        }
      }
    }

    if (category) {
      query.sportType = category;
    }

    if (price) {
      const [min, max] = price.split("-").map(Number);
      query.minPrice = { $gte: min };
      query.maxPrice = { $lte: max };
    }

    const sortQuery = {};

    if (homeCategory === "recommended") {
      query.availableTickets = { $gte: 500 };
      sortQuery.soldTickets = -1;
    }

    if (homeCategory === "trending") {
      query.availableTickets = { $gte: 500 };
      sortQuery.soldTickets = -1;
    }

    if (homeCategory === "popular") {
      sortQuery.stadium.stadiumDetails.city = user?.preferences?.venue;
    }

    if (homeCategory === "livenow") {
      query.matchDate = { $eq: new Date().toISOString().split("T")[0] };
    }

    if (sort === "popular") {
      sortQuery.soldTickets = -1;
    }
    if (sort === "low-high") {
      sortQuery.minPrice = 1;
    }
    if (sort === "high-low") {
      sortQuery.maxPrice = -1;
    }
    if (sort === "latest") {
      sortQuery.createdAt = -1;
    }

    const limit = 10;
    const skip = (page - 1) * limit;

    const events = await filterAndSortService({
      query,
      sortQuery,
      skip,
      limit,
    });

    const timeFilteredEvents = events.filter(validateEventAvailability);

    logger.info("Fetch images from S3 bucket");
    const updatedEvents = await Promise.all(
      timeFilteredEvents.map(async (event) => {
        const bannerKey = event.bannerImageKey;
        const thumbnailKey = event.thumbnailImageKey;

        const bannerImage = await getObjectURL(bannerKey);
        const thumbnailImage = await getObjectURL(thumbnailKey);

        const updatedEvent = {
          ...event,
          bannerImage,
          thumbnailImage,
        };

        return updatedEvent;
      })
    );

    res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Events fetched successfully",
      events: updatedEvents,
      hasMore: updatedEvents.length === limit,
    });
  } catch (error) {
    logger.error(`Error fetching events: ${error.stack || error.message}`);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ success: false, error: "Something went wrong" });
  }
};

export const getSingleEventController = async (req, res) => {
  const { eventSlug } = req.params;

  logger.http(`${req.method} ${req.originalUrl}`);
  try {
    if (!eventSlug) {
      logger.warn("Missing required field");
      return res.status(STATUS_CODE.MISSING_FIELD).json({
        success: false,
        message: "Missing field",
      });
    }

    logger.info(`Fetching Event by id ${eventSlug}`);
    const event = await eventDetails(eventSlug);

    const buildMatchDateTime = (event) => {
      if (!event?.matchDate || !event?.matchTime) {
        return null;
      }

      const base = new Date(event.matchDate);
      const [hours, minutes] = event.matchTime.split(":").map(Number);

      base.setHours(hours);
      base.setMinutes(minutes);
      base.setSeconds(0);
      base.setMilliseconds(0);

      return base;
    };

    const isEventValid = (event, now = new Date(), blockHours = 4) => {
      const dateTime = buildMatchDateTime(event);
      if (!dateTime || isNaN(dateTime)) {
        return false;
      }

      const diffMs = dateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      return dateTime >= now && diffHours >= blockHours;
    };

    if (!isEventValid(event)) {
      return res.status(STATUS_CODE.SUCCESS).json({
        success: false,
        message: "Event is no longer available",
        event: null,
      });
    }

    const bannerKey = event.bannerImageKey;
    const thumbnailKey = event.thumbnailImageKey;

    const bannerImage = await getObjectURL(bannerKey);
    const thumbnailImage = await getObjectURL(thumbnailKey);

    const updatedEvent = {
      ...event,
      bannerImage,
      thumbnailImage,
    };

    if (!updatedEvent) {
      logger.info(`Event not found for ${eventSlug}`);
      return res
        .status(STATUS_CODE.MISSING_FIELD)
        .json({ error: "Event not found" });
    }

    if (updatedEvent.stadium) {
      const updatedStadium = {
        ...updatedEvent.stadium,
        layoutImage: await getObjectURL(updatedEvent.stadium.layoutImageKey),
      };

      updatedStadium.shapes = await Promise.all(
        updatedEvent.stadium.shapes.map(async (shape) => {
          if (shape.type === "image") {
            const imageUrl = await getObjectURL(shape.imageKey);
            return { ...shape, imageUrl };
          }
          return shape;
        })
      );
      updatedEvent.stadium = updatedStadium;
    }

    logger.info("Event fetched successfully");
    res.json({ success: true, message: "Event fetched", event: updatedEvent });
  } catch (error) {
    logger.error(`Error Event Fetch: ${error.stack || error.message}`);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

export const searchEventController = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    logger.http(`${req.method} ${req.originalUrl}`);
    logger.info(`Fetch event for query=${searchQuery}`);

    const events = await findEventsForUser(searchQuery);

    // If null or empty
    if (!events || events.length === 0) {
      return res.status(STATUS_CODE.SUCCESS).json({
        success: true,
        message: "Events not found",
        events: [],
      });
    }

    // Apply correct time filtering
    const timeFiltered = events.filter((event) =>
      validateEventAvailability(event)
    );

    // Still empty after filtering?
    if (timeFiltered.length === 0) {
      return res.status(STATUS_CODE.SUCCESS).json({
        success: true,
        message: "No available events",
        events: [],
      });
    }

    const updatedEvents = timeFiltered.map((event) => ({
      title: event.eventTitle,
      id: event._id,
      slug: event.slug,
    }));

    logger.info("Event fetched successfully");

    res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Event fetched successfully",
      events: updatedEvents.slice(0, 10),
    });
  } catch (error) {
    logger.error(`Error fetch event ${error.stack || error.message}`);
    res.status(STATUS_CODE.SERVER_ERROR).json({
      success: false,
      messgae: "Something went wrong",
    });
  }
};

// get event bookings (organizer)
export const getBookingsController = asyncHandler(async (req, res) => {
  const { eventSlug } = req.params;
  const userId = req.user._id;

  const organizer = await checkOrganizer(userId);

  const result = await getEventBookings(eventSlug, organizer._id, req.query);

  sendResponse(res, result, STATUS_CODE.SUCCESS);
});
