import { verifyTokenAndGetUser } from "../repositories/user/user.repository.js";
import { getObjectURL } from "../services/s3.service.js";
import { ERRORS, SOCKET_ERROR_TYPE } from "./constants/constants.js";
import { sanitizeUser } from "./user/sanitizeUser.js";

export const verifySocketToken = async (token) => {
  const user = await verifyTokenAndGetUser(token);

  if (!user) {
    const err = new Error(ERRORS.USER_NOT_FOUND);
    err.data = { type: SOCKET_ERROR_TYPE.SOCKET_AUTH };
    throw err;
  }

  if (user.status === "blocked") {
    const err = new Error(ERRORS.USER_BLOCKED);
    err.data = { type: SOCKET_ERROR_TYPE.SOCKET_AUTH };
    throw err;
  }

  if (user.profileImage && user.profileImage.includes("uploads")) {
    const url = await getObjectURL(user.profileImage);
    user.profileImage = url;
  }

  return sanitizeUser(user);
};
