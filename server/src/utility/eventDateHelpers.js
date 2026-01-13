export const buildMatchDateTime = (event) => {
  if (!event.matchDate || !event.matchTime) {
    return null;
  }

  const base = new Date(event.matchDate);
  const [hours, minutes] = event.matchTime.split(":").map(Number);

  base.setHours(hours);
  base.setMinutes(minutes);
  base.setSeconds(0);
  base.setMilliseconds(0);

  return base;
};

export function isEventValid(event, now, fourHours) {
  const dateTime = buildMatchDateTime(event);
  if (!dateTime || isNaN(dateTime)) {
    return false;
  }

  return dateTime >= now && dateTime.getTime() - now.getTime() >= fourHours;
}
