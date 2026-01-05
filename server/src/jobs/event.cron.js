import cron from "node-cron";
import logger from "../config/logger.js";
import { ENV } from "../config/env.conf.js";
import { findEvents } from "../repositories/cron/event.repository.js";

cron.schedule(ENV.EVENT_CHECK_CRON, async () => {
  logger.info("Event completion cron started");

  try {
    const now = new Date();

    const query = {
      eventStatus: { $in: ["Published", "Postpone"] },
      isDeleted: false,
    };

    const events = await findEvents(query);

    for (const event of events) {
      const matchStart = new Date(event.matchDate);
      const [hours, minutes] = event.matchTime.split(":");

      matchStart.setHours(Number(hours));
      matchStart.setMinutes(Number(minutes));

      const matchEnd = new Date(
        matchStart.getTime() + event.matchDuration * 60 * 1000
      );

      if (now >= matchEnd) {
        event.eventStatus = "Completed";
        event.isBookingOpen = false;

        event.payoutStatus = "PENDING";

        await event.save();

        logger.info(
          `Event marked as COMPLETED: ${event._id} (${event.eventTitle})`
        );
      }
    }

    logger.info("Event completion cron finished");
  } catch (error) {
    logger.error("Event completion cron failed", error);
  }
});
