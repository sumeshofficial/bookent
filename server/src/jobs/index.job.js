import logger from "../config/logger.js";
import "./userOrderStatus.js";
import "./refund/refund.cron.js";

export const initCronJobs = () => {
  logger.info("Cron jobs initialized");
};
