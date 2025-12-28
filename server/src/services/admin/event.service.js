import {
  fetchAllEvents,
  fetchEvent,
} from "../../repositories/admin/event.repository.js";
import { updateEvent, updateEvents } from "./helper/updateEvent.helper.js";

export const getAllEvents = async (filters = {}) => {
  const data = await fetchAllEvents(filters);

  const updatedEvents = await updateEvents(data.events);

  return {
    ...data,
    events: updatedEvents,
  };
};

export const getEvent = async (eventSlug) => {
  const event = await fetchEvent(eventSlug);

  const updatedEvent = await updateEvent(event);

  return updatedEvent;
};
