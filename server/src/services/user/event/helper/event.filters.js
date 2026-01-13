import { buildMatchDateTime } from "../../../../utility/eventDateHelpers.js";

// Get Recommended Events
export function filterRecommended(validEvents, now) {
  return validEvents
    .filter((event) => {
      const dateTime = buildMatchDateTime(event);
      return dateTime && dateTime >= now;
    })
    .sort((a, b) => b.soldTickets - a.soldTickets)
    .slice(0, 10);
}

// Get Trending Events
export function filterTrending(validEvents) {
  return [...validEvents]
    .sort((a, b) => b.soldTickets - a.soldTickets)
    .slice(0, 10);
}

// Get Live Events
export function filterLive(validEvents) {
  const today = new Date().toISOString().split("T")[0];

  return validEvents.filter((event) => {
    const dateObj = buildMatchDateTime(event);
    if (!dateObj || isNaN(dateObj)) {
      return false;
    }

    const eventDateISO = dateObj.toISOString().split("T")[0];
    return eventDateISO === today;
  });
}

// Get Near Events
export function filterCity(validEvents, city) {
  if (!city) {
    return [];
  }
  return validEvents
    .filter(
      (event) =>
        event?.stadium?.stadiumDetails?.city?.toLowerCase() ===
        city.toLowerCase()
    )
    .slice(0, 10);
}
