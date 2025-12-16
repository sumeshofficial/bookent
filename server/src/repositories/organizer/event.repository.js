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