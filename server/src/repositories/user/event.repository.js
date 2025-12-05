import Event from "../../models/event.model.js";

export const fetchEventById = async (eventId) => {
  return await Event.findById(eventId).lean();
};

export const findEventsRepo = async () => {
  return await Event.find({ eventStatus: "Published" }).lean();
};
