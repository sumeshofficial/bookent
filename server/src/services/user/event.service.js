import { findEventsRepo } from "../../repositories/user/event.repository.js";
import { getObjectURL } from "../s3.service.js";

// Business logic for home page sections
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

  const recommendedEvents = updatedEvents
    .filter((event) => event.matchDate >= new Date())
    .sort((a, b) => b.soldTickets - a.soldTickets)
    .slice(0, 10);

  const trendingEvents = [...updatedEvents]
    .sort((a, b) => b.soldTickets - a.soldTickets)
    .slice(0, 10);

  const today = new Date().toISOString().split("T")[0];
  const liveEvents = updatedEvents.filter((e) => {
    if (!e.matchDate) {
      return false;
    }
    const eventDate = new Date(e.matchDate).toISOString().split("T")[0];
    return eventDate === today;
  });

  let popularInYourCity = [];
  if (city) {
    popularInYourCity = updatedEvents
      .filter(
        (event) =>
          event?.stadium?.stadiumDetails?.city?.toLowerCase() ===
          city.toLowerCase()
      )
      .slice(0, 10);
  }

  return {
    recommendedEvents,
    trendingEvents,
    liveEvents,
    popularInYourCity,
  };
};
