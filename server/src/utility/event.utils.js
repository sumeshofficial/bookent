import { checkSlugExists } from "../repositories/organizer/slug.repository.js";
import { ERRORS, STATUS_CODE } from "./constants.js";
import { AppError, createSlug } from "./helpers.js";

export const isSlugExists = async (Model, title, excludeId = null) => {
  const slug = createSlug(title);
  const query = { slug, isDeleted: false };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const exists = await checkSlugExists(Model, query);
  if (exists) {
    throw new AppError(
      STATUS_CODE.CONFLICT,
      ERRORS.SLUG_ALREADY_EXISTS.CODE,
      ERRORS.SLUG_ALREADY_EXISTS.MSG
    );
  }

  return slug;
};
