import { Server } from "socket.io";
import socketAuth from "../middlewares/common/socket.middleware.js";
import dotenv from "dotenv";
import logger from "./logger.js";
import userSocketHandlers from "../sockets/user/user.socket.js";
import { SOCKET_EVENTS } from "../utility/constants.js";

dotenv.config();

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    logger.info(`User connected: ${socket.user._id}`);

    socket.join(socket.user._id);

    userSocketHandlers(io, socket);
  });

  return io;
};

export const getIO = () => io;
