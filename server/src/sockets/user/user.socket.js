import logger from "../../config/logger.js";
import {
  lockSectionQuantity,
  releaseLockById,
  getAllCurrentLocks,
} from "../../services/user/seatLock.service.js";
import { SOCKET_EVENTS } from "../../utility/constants/constants.js";

export default function userSocketHandlers(io, socket) {
  socket.on(SOCKET_EVENTS.JOIN_EVENT, async ({ eventId }) => {
    if (socket.currentEvent && socket.currentEvent !== eventId) {
      socket.leave(socket.currentEvent);
    }

    if (!socket.rooms.has(eventId)) {
      socket.join(eventId);
    }

    const existingLocks = await getAllCurrentLocks(eventId);

    socket.emit(SOCKET_EVENTS.SEAT_UPDATE_BULK, existingLocks);

    socket.currentEvent = eventId;
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

  // 4. ON DISCONNECT RELEASE ALL LOCKS
  socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
    logger.info(`User disconnected: ${socket.user._id}`);
    logger.info(
      `DISCONNECT TRIGGERED ${JSON.stringify({
        socketId: socket.id,
        userId: socket.user._id,
        event: socket.currentEvent,
      })}`
    );
  });
}
