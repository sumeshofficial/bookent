import { createClient } from "redis";
import { getIO } from "./socket.conf.js";
import logger from "./logger.js";
import dotenv from "dotenv";
import { REDIS_EVENTS } from "../utility/constants/constants.js";
import { ENV } from "./env.conf.js";
dotenv.config();

export const initSeatPubSub = async () => {
  const sub = createClient({ url: ENV.REDIS_URI });
  await sub.connect();

  await sub.subscribe(REDIS_EVENTS.SEAT_UPDATE, (message) => {
    const data = JSON.parse(message);

    const io = getIO();
    io.to(data.eventId).emit(REDIS_EVENTS.SEAT_UPDATE, data);

    logger.info(`Seat update → WS sent: ${JSON.stringify(data, null, 2)}`);
  });

  logger.info("Seat PubSub subscriber active");
};
