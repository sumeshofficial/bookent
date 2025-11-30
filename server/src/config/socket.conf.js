import { Server } from "socket.io";
import socketAuth from "../middlewares/common/socket.middleware.js";
import dotenv from "dotenv";
import logger from "./logger.js";
import userSocketHandlers from "../sockets/user/user.socket.js";

dotenv.config();

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  });

  // Authenticate socket
  io.use(socketAuth);

  io.on("connection", (socket) => {
    logger.info("User connected:", socket.user._id);

    // JOIN room based on user ID
    socket.join(socket.user._id);

    // Attach all handlers
    userSocketHandlers(io, socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};