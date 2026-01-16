import Event from "../../models/event.model.js";

export const checkEventExists = async (query = {}) => {
  return await Event.exists(query).lean();
};

// Create Event
export const createEvent = async (newEvent) => {
  return await Event.create(newEvent);
};

export const findEventByOrganizerIdAndEventId = async (
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
export const findEventByOrganizerIdAndEventSlug = async (
  organizerId,
  eventSlug,
  session
) => {
  const query = Event.findOne({
    organizer: organizerId,
    slug: eventSlug,
  }).populate({
    path: "stadium",
    select: "shapes stadiumDetails.stadiumName",
  });

  if (session) {
    query.session(session);
  }

  return await query;
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

export const findEvents = async (organizerId) => {
  return Event.find({
    organizer: organizerId,
  });
};

export const aggregateEvents = async (aggregatePipeline) => {
  return Event.aggregate(aggregatePipeline);
};

export const countDocuments = async (query) => {
  return Event.countDocuments({ ...query, isDeleted: false });
};

export const findEvent = async (organizerId, eventSlug) => {
  return Event.findOne({
    slug: eventSlug,
    organizer: organizerId,
    isDeleted: false,
  });
};

export const updateEvent = async (eventId, newData) => {
  return Event.findByIdAndUpdate(eventId, { $set: newData }, { new: true });
};

export const eventExists = async (eventId) => {
  return Event.exists({ _id: eventId, isDeleted: false });
};

// Delete Event
export const deleteEventService = async (organizerId, eventId) => {
  return await Event.updateOne(
    { organizer: organizerId, _id: eventId },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    }
  );
};