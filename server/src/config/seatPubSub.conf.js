import { createClient } from "redis";
import { getIO } from "./socket.conf.js";
import logger from "./logger.js";
import dotenv from "dotenv";
import { SOCKET_EVENTS } from "../utility/constants.js";

dotenv.config();

export const initSeatPubSub = async () => {
  const sub = createClient({ url: process.env.REDIS_URI });
  await sub.connect();

  await sub.subscribe(SOCKET_EVENTS.SEAT_UPDATE, (message) => {
    const data = JSON.parse(message);

    const io = getIO();
    io.to(data.eventId).emit(SOCKET_EVENTS.SEAT_UPDATE, data);

    logger.info(`Seat update → WS sent: ${JSON.stringify(data, null, 2)}`);
  });

  logger.info("Seat PubSub subscriber active");
};
