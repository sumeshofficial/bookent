import { getObjectURL } from "../../s3.service.js";

export const updateEvents = async (events) => {
  const updatedEvents = await Promise.all(
    events.map(async (event) => {
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

  return updatedEvents;
};

export const updateEvent = async (event) => {
  const thumbnailImage = await getObjectURL(event.thumbnailImageKey);
  const bannerImage = await getObjectURL(event.bannerImageKey);

  const updatedEvent = {
    ...event,
    bannerImage,
    thumbnailImage,
  };

  return updatedEvent;
};
