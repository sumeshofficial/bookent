import logger from "../../config/logger.js";
import {
  lockSectionQuantity,
  releaseLockById,
  confirmBookingByLock,
  releaseAllLocksForUser,
} from "../../services/user/seatLock.service.js";
import { SOCKET_EVENTS } from "../../utility/constants.js";

export default function userSocketHandlers(io, socket) {
  // 1. JOIN EVENT ROOM

  socket.on(SOCKET_EVENTS.JOIN_EVENT, ({ eventId }) => {
    // Leave previous only if DIFFERENT event ID
    if (socket.currentEvent && socket.currentEvent !== eventId) {
      socket.leave(socket.currentEvent);
      console.log("Left previous room:", socket.currentEvent);
    }

    // Only join if not already joined
    if (!socket.rooms.has(eventId)) {
      socket.join(eventId);
      console.log("Joined room:", eventId);
    }

    socket.currentEvent = eventId;

    console.log("ROOMS NOW:", [...socket.rooms]);
  });

  // 2. LOCK SECTION
  socket.on(
    SOCKET_EVENTS.LOCK_SECTION,
    async ({ eventId, sectionId, qty }, cb) => {
      try {
        const result = await lockSectionQuantity({
          eventId,
          sectionId,
          qty,
          userId: socket.user._id,
        });

        cb({ success: true, lockId: result.lockId });
      } catch (err) {
        logger.error(`Lock section error: ${err.stack || err.message}`);
        cb({ success: false, error: err.message });
      }
    }
  );

  // 3. RELEASE SECTION
  socket.on(SOCKET_EVENTS.RELEASE_SECTION, async ({ lockId }) => {
    await releaseLockById({ lockId });
  });

  // 4. CONFIRM BOOKING
  socket.on(SOCKET_EVENTS.CONFIRM_BOOKING, async ({ lockIds }, cb) => {
    try {
      await confirmBookingByLock({
        lockIds,
        userId: socket.user._id,
      });

      cb?.({ success: true });
    } catch (err) {
      cb?.({ success: false, error: err.message });
    }
  });

  // 5. ON DISCONNECT RELEASE ALL LOCKS
  socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
    logger.info(`User disconnected: ${socket.user._id}`);
    logger.info(
      `DISCONNECT TRIGGERED ${JSON.stringify({
        socketId: socket.id,
        userId: socket.user._id,
        event: socket.currentEvent,
      })}`
    );

    // if (socket.currentEvent) {
    //   await releaseAllLocksForUser({
    //     eventId: socket.currentEvent,
    //     userId: socket.user._id,
    //   });
    // }
  });
}
