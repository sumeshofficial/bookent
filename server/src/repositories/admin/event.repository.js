import Event from "../../models/event.model.js";
import { buildEventFilter } from "./helper/buildEventFilter.js";

export const fetchAllEvents = async (filters = {}) => {
  const { query, sortOption, skip, limit, page } = buildEventFilter(filters);

  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;

  const [events, total] = await Promise.all([
    Event.find(query).sort(sortOption).skip(skip).limit(safeLimit).lean(),
    Event.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / safeLimit);

  return {
    events,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const fetchEvent = async (eventSlug) => {
  return Event.findOne({
    slug: eventSlug,
  })
    .populate({
      path: "stadium",
      select: "shapes.title stadiumDetails.stadiumName",
    })
    .lean();
};

// Event details
export const eventDetails = async (eventSlug) => {
  return await Event.findOne({
    slug: eventSlug,
    eventStatus: { $nin: ["Draft", "Completed"] },
    isDeleted: false,
  })
    .populate("stadium")
    .populate("organizer")
    .lean();
};
