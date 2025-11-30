import logger from "../../config/logger.js";
import {
  lockSectionQuantity,
  releaseLockById,
  confirmBookingByLock,
  releaseAllLocksForUser,
} from "../../services/user/seatLock.service.js";

export default function userSocketHandlers(io, socket) {
  // 1. JOIN EVENT ROOM
  socket.on("join-event", ({ eventId }) => {
    console.log("ROOMS AFTER JOIN:", [...socket.rooms]);
    socket.join(eventId);
    socket.currentEvent = eventId;
    logger.info(`User ${socket.user._id} joined event room → ${eventId}`);
  });

  // 2. LOCK SECTION
  socket.on("lock-section", async ({ eventId, sectionId, qty }, cb) => {
    try {
      const result = await lockSectionQuantity({
        eventId,
        sectionId,
        qty,
        userId: socket.user._id,
      });

      cb({ success: true, lockId: result.lockId });
    } catch (err) {
      logger.error("Lock section error:", err);
      cb({ success: false, error: err.message });
    }
  });

  // 3. RELEASE SECTION
  socket.on("release-section", async ({ lockId }) => {
    await releaseLockById({ lockId });
  });

  // 4. CONFIRM BOOKING
  socket.on("confirm-booking", async ({ lockIds }, cb) => {
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
  socket.on("disconnect", async () => {
    logger.info("User disconnected:", socket.user._id);

    if (socket.currentEvent) {
      await releaseAllLocksForUser({
        eventId: socket.currentEvent,
        userId: socket.user._id,
      });
    }
  });
}
