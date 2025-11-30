import { createClient } from "redis";
import { getIO } from "./socket.conf.js";
import logger from "./logger.js";
import dotenv from "dotenv";
dotenv.config();

export const initSeatPubSub = async () => {
  const sub = createClient({ url: process.env.REDIS_URI });
  await sub.connect();

  await sub.subscribe(process.env.CHANNEL, (message) => {
    const data = JSON.parse(message);

    console.log("ACTIVE SOCKETS:", getIO().engine.clientsCount);
    const io = getIO();
    io.to(data.eventId).emit(process.env.CHANNEL, data);

    logger.info(`Seat update → WS sent: ${JSON.stringify(data, null, 2)}`);
  });

  logger.info("Seat PubSub subscriber active");
};
