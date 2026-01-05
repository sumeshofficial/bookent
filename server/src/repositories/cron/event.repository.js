import Event from "../../models/event.model.js";
import Order from "../../models/order.model.js";

export const releaseReservedTickets = async (query, session) => {
  query = {
    ...query,
    "meta.isReservationRestored": { $ne: true },
  };
  const ordersNeedingRestore = await Order.find(query).session(session);

  if (!ordersNeedingRestore.length) {
    return;
  }

  for (const order of ordersNeedingRestore) {
    const { eventId, seat } = order;

    await Event.updateOne(
      {
        _id: eventId,
        "ticketSetup.sectionId": seat.sectionId,
      },
      {
        $inc: {
          "ticketSetup.$.reservedTickets": -seat.qty,
          "ticketSetup.$.availableTickets": seat.qty,
          availableTickets: seat.qty,
        },
      },
      { session }
    );

    if (!order.meta) {
      order.meta = {};
    }

    order.meta.isReservationRestored = true;
    await order.save({ session });
  }
};

export const findEvents = async (query, session = null) => {
  return Event.find(query).session(session);
};