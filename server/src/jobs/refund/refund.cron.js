import cron from "node-cron";
import { processRefund } from "./refund.job.js";
import logger from "../../config/logger.js";
import { ENV } from "../../config/env.conf.js";

cron.schedule(ENV.REFUND_CHECK_CRON, async () => {
  logger.info("Refund cron triggered");

  try {
    await processRefund();
  } catch (error) {
    logger.error(`Refund cron failed ${error.stack || error.message}`);
  }
});
