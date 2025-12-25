import Event from "../../models/event.model.js";

export const checkEventExists = async (query = {}) => {
  return await Event.exists(query).lean();
};

// Create Event
export const createEvent = async (newEvent) => {
  return await Event.create(newEvent);
};

export const findeEventByOrganizerIdAndEventId = async (
  organizerId,
  eventId
) => {
  return await Event.findOne({ organizer: organizerId, _id: eventId }).lean();
};

/**
 * Find event
 * @param {String} eventSorganizerIdlug
 * @param {String} eventSlug
 */
export const findeEventByOrganizerIdAndEventSlug = async (
  organizerId,
  eventSlug
) => {
  return await Event.findOne({
    organizer: organizerId,
    slug: eventSlug,
  })
    .populate({
      path: "stadium",
      select: "shapes stadiumDetails.stadiumName",
    })
    .lean();
};

// Count Events
export const countEventsByOrganizerForDate = async ({
  organizerId,
  startDate,
  endDate,
}) => {
  return Event.countDocuments({
    organizer: organizerId,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
    isDeleted: false,
  });
};
