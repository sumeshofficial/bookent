import { getIO } from "../../config/socket.conf.js";
import { updateUserStatus } from "../../repositories/user/user.repository.js";
import { SOCKET_EVENTS } from "../../utility/constants/constants.js";

export const updateUserStatusService = async (userId, newStatus) => {
  await updateUserStatus(userId, newStatus);

  const io = getIO();
  io.to(userId).emit(SOCKET_EVENTS.USER_BLOCKED, {
    message: "Your account was blocked by admin",
  });
};
