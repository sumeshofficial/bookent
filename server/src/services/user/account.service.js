import { updateUserService } from "../../repositories/user/user.repository.js";
import { STATUS_CODE } from "../../utility/constants.js";
import { AppError } from "../../utility/helpers.js";
import { sanitizeUser } from "../../utility/user/sanitizeUser.js";
import { getObjectURL } from "../s3.service.js";
import { reverseGeocoding } from "../user.service.js";

// Get user service
export const getUser = async (user) => {
  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "USER_NOT_FOUND",
      "User not found"
    );
  }

  let updatedUser;
  if (user.role === "user" && user.location) {
    const response = await reverseGeocoding({
      lat: user.location.latitude,
      lng: user.location.longitude,
    });

    updatedUser = {
      ...user,
      location: { ...user.location, address: response },
    };
  }

  return updatedUser;
};

// Update user service
export const updateUser = async (body) => {
  const { id, data } = body;

  if (!id || !data) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "Missing fields."
    );
  }

  const user = await updateUserService({ id, data });

  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "USER_NOT_FOUND",
      "User not found"
    );
  }

  if (user.profileImage && user.profileImage.includes("uploads")) {
    const url = await getObjectURL(user.profileImage);
    user.profileImage = url;
  }

  const updatedUser = sanitizeUser(user);

  return updatedUser;
};
