import cron from "node-cron";
import logger from "../config/logger.js";
import { ORDER_STATUS } from "../utility/constants/constants.js";
import { updateOrderStatus } from "../repositories/cron/order.repository.js";
import { ENV } from "../config/env.conf.js";
import { releaseReservedTickets } from "../repositories/cron/event.repository.js";
import mongoose from "mongoose";

cron.schedule(ENV.ORDER_CLEANUP_CRON, async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const twentyFourHoursAgo = new Date(Date.now() - 10 * 60 * 1000);

    const query = {
      status: ORDER_STATUS.PENDING_PAYPAL_ORDER,
      createdAt: { $lt: twentyFourHoursAgo },
    };

    await releaseReservedTickets(query, session);

    const newData = { status: ORDER_STATUS.ABANDONED };
    const result = await updateOrderStatus(query, newData, session);

    await session.commitTransaction();
    session.endSession();

    logger.info(
      `[CRON] Order cleanup job executed. Restored reservations and updated ${result.modifiedCount} orders to Abandoned.`
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(
      `[CRON] Error updating pending orders (transaction aborted): ${error}`
    );
  }
});
