import { verifyUserTicket } from "../../../repositories/organizer/order.repository.js";
import { getOrder } from "../../../repositories/user/order.repository.js";
import { findUserById } from "../../../repositories/user/user.repository.js";
import { validateEventMatch } from "./helper/validateEventMatch.js";
import { validateEventOngoing } from "./helper/validateEventOnGoing.js";
import { validateOrderAndTicket } from "./helper/validateOrderAndTicket.js";
import { validateOrganizerAndEvent } from "./helper/validateOrganizerAndEvent.js";
import { verifyJWT } from "./helper/verifyJWT.js";

export const verifyTicket = async ({ qrData, eventId, userId }) => {
  const {
    orderId,
    eventId: qrEventId,
    userId: qrUserId,
  } = await verifyJWT(qrData);

  console.log(orderId, eventId, userId);

  validateEventMatch({ qrEventId, eventId });

  const event = await validateOrganizerAndEvent({
    userId,
    eventId,
  });

  validateEventOngoing(event);

  const order = await getOrder(orderId, qrUserId);
  const user = await findUserById(qrUserId);

  validateOrderAndTicket(order);

  const updatedOrder = await verifyUserTicket(orderId, qrUserId);

  return {
    eventTitle: updatedOrder.eventDetails?.title,
    seatInfo: updatedOrder.seat.qty,
    userName: user.fullname,
  };
};
