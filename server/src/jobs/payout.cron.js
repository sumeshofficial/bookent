import cron from "node-cron";
import mongoose from "mongoose";
import logger from "../config/logger.js";
import { ENV } from "../config/env.conf.js";
import { findEvents } from "../repositories/cron/event.repository.js";
import { findAllOrders } from "../repositories/cron/order.repository.js";
import { createOrganizerPayout } from "../services/organizer/payout.service.js";
import { createPayoutTransaction } from "../repositories/cron/transaction.repository.js";
import { findAdmin } from "../repositories/cron/user.repository.js";
import { updateAdminWallet } from "../repositories/admin/updateAdminWallet.js";
import { ORDER_STATUS } from "../utility/constants/constants.js";

cron.schedule(ENV.PAYOUT_CHECK_CRON, async () => {
  logger.info("Organizer payout cron started");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const query = {
      eventStatus: "Completed",
      payoutStatus: "PENDING",
      isDeleted: false,
    };

    const events = await findEvents(query, session);

    const admin = await findAdmin(session);

    for (const event of events) {
      logger.info(`Processing payout for event ${event._id}`);

      const orderQuery = {
        eventId: event._id,
        status: ORDER_STATUS.CONFIRMED,
      };

      const orders = await findAllOrders(orderQuery, session);

      if (!orders.length) {
        logger.warn(`No confirmed orders for event ${event._id}`);
        continue;
      }

      const payoutAmount = orders.reduce((sum, order) => {
        return sum + order.seat.price * order.seat.qty;
      }, 0);

      if (payoutAmount <= 0) {
        logger.warn(`Invalid payout amount for event ${event._id}`);
        continue;
      }

      const payoutResult = await createOrganizerPayout({
        organizerId: event.organizer,
        amount: payoutAmount,
        currency: "USD",
      });

      await updateAdminWallet(-payoutAmount, session);

      await createPayoutTransaction({
        adminId: admin._id,
        payoutResult,
        payoutAmount,
        event,
        session,
      });

      event.payoutStatus = "COMPLETED";
      event.payoutReference = payoutResult.payout_batch_id;
      event.payoutProcessedAt = new Date();

      await event.save({ session });

      logger.info(
        `Payout completed for event ${event._id} | Amount: ${payoutAmount}`
      );
    }

    await session.commitTransaction();
    session.endSession();
    logger.info("Organizer payout cron finished");
  } catch (error) {
    console.log(error);
    logger.error(
      `Payout failed for event ${error?.event?._id || "unknown"}`,
      error
    );
    await session.abortTransaction();
    session.endSession();
    logger.error("Organizer payout cron failed", error);
  }
});
