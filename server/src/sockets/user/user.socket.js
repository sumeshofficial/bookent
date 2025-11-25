import logger from "../../config/logger.js";

export default function userSocketHandlers(io, socket) {
  socket.on("disconnect", () => {
    logger.info("User disconnected:", socket.user.id);
  });
}
