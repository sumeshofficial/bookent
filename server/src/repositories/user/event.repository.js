import Event from "../../models/event.model.js";

export const fetchEventById = async (eventId) => {
  return await Event.findById(eventId).lean();
};

export const findEventsRepo = async () => {
  return await Event.find({
    eventStatus: { $in: ["Published", "Postpone"] },
    isDeleted: false,
    isBookingOpen: true,
  }).lean();
};

export const reserveTicket = async ({ event, section, session }) => {
  const qty = section.qty;

  const res = await Event.updateOne(
    {
      _id: event._id,
      ticketSetup: {
        $elemMatch: {
          sectionId: section._id,
          availableTickets: { $gte: qty },
        },
      },
    },
    {
      $inc: {
        "ticketSetup.$.availableTickets": -qty,
        "ticketSetup.$.reservedTickets": qty,
        availableTickets: -qty,
      },
    },
    { new: true, session }
  );

  return res;
};

export const makeTicketSold = async (eventId, seat, session) => {
  await Event.updateOne(
    {
      _id: eventId,
      "ticketSetup.sectionId": seat.sectionId,
      "ticketSetup.reservedTickets": { $gte: seat.qty },
    },
    {
      $inc: {
        "ticketSetup.$.reservedTickets": -seat.qty,
        "ticketSetup.$.soldTickets": seat.qty,
        soldTickets: seat.qty,
      },
    },
    { session }
  );
};

export const findEvents = async (search) => {
  return Event.find({
    $or: search,
    eventStatus: "Published",
    isDeleted: false,
  })
    .populate("stadium")
    .sort({ createdAt: -1 })
    .lean();
};

export const filterAndSortService = async ({
  query,
  sortQuery,
  skip,
  limit,
}) => {
  const events = await Event.find(query)
    .populate("stadium")
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .lean();

  return events;
};