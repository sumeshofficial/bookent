import { getIO } from "../../config/socket.conf.js";
import { updateUserStatus } from "../../repositories/user/user.repository.js";
import { STATUS_CODE } from "../../utility/constants.js";
import { AppError } from "../../utility/helpers.js";

export const updateUserStatusService = async (data) => {
  const { id, status } = data;

  if (!id || !status) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "UserId and status are required."
    );
  }

  await updateUserStatus(id, status);

  const io = getIO();
  io.to(id).emit("user-blocked", {
    message: "Your account was blocked by admin",
  });
};
