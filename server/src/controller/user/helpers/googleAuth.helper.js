import { reverseGeocoding } from "../../../services/user.service.js";
import { sendTokens } from "../../../utility/sendTokens.js";
import {
  sendPopupResponse,
  validateGoogleUser,
} from "../../../utility/user/googleAuth.js";
import { sanitizeUser } from "../../../utility/user/sanitizeUser.js";

export const validateGoogleLogin = (user, FRONTEND_URL, res) => {
  const validationError = validateGoogleUser(user);
  if (validationError) {
    sendPopupResponse(res, validationError, FRONTEND_URL);
    return false;
  }
  return true;
};

export const generateGoogleTokens = async (user, FRONTEND_URL, res) => {
  const token = await sendTokens(res, user);
  if (!token) {
    sendPopupResponse(res, { error: "Token generation failed" }, FRONTEND_URL);
    return null;
  }
  return token;
};

export const enrichUserLocation = async (user) => {
  if (user.role === "user" && user.location) {
    const geoAddress = await reverseGeocoding({
      lat: user.location.latitude,
      lng: user.location.longitude,
    });
    user.location.address = geoAddress;
  }
};

export const prepareGoogleResponse = (user, token) => {
  const safeUser = sanitizeUser(user);
  return { accessToken: token, user: safeUser };
};
