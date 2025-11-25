import { verifySocketToken } from "../../utility/verifySocketToken.js";

export default async function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No auth token"));
    }

    const user = await verifySocketToken(token);
    socket.user = user;

    next();
  } catch (err) {
    next(new Error(err.message || "Unauthorized"));
  }
}
