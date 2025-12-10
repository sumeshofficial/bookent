export function mapEventWithImages(event, getObjectURL) {
  if (!event) {
    return event;
  }

  return {
    ...event,
    bannerImage: event.bannerImage ? getObjectURL(event.bannerImage) : null,
    thumbnailImage: event.thumbnailImage || null,
  };
}
