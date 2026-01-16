import Stadium from "../../models/stadium.model.js";
import {
  createStadiumRepo,
  softDeleteStadiumService,
  updateStadiumService,
} from "../../repositories/organizer/stadium.repository.js";
import { isSlugExists } from "../../utility/event.utils.js";
import { validateOrganizer } from "./helper/validateOrganizer.helper.js";
import { validateStadium } from "./helper/stadium/validateStadium.helper.js";
import { deleteObject } from "../s3.service.js";
import { buildShapesUpdate } from "./helper/stadium/buildShapesUpdate.helper.js";
import { buildStadiumDetails } from "./helper/stadium/buildStadiumDetails.helper.js";
import { handleLayoutImage } from "./helper/stadium/handleLayoutImage.helper.js";

export const createStadium = async (payload) => {
  const slug = await isSlugExists(Stadium, payload.stadiumDetails.stadiumName);
  payload.slug = slug;

  const stadium = await createStadiumRepo(payload);
  return stadium;
};

export const updateStadium = async (stadiumId, payload, userId) => {
  const organizer = await validateOrganizer(userId);
  const existing = await validateStadium(organizer._id, stadiumId);

  const updateData = {
    ...buildStadiumDetails(payload, existing.stadiumDetails),
    ...(await buildShapesUpdate(payload, existing)),
    ...(await handleLayoutImage(payload, existing)),
  };

  return await updateStadiumService(stadiumId, updateData);
};

// Delete Stadium
export const deleteStadium = async (userId, stadiumId) => {
  const organizer = await validateOrganizer(userId);
  const stadium = await validateStadium(organizer._id, stadiumId);

  if (stadium?.layoutImageKey) {
    await deleteObject(stadium.layoutImageKey);
  }
  for (const shape of stadium.shapes) {
    if (shape.imageKey) {
      await deleteObject(shape.imageKey);
    }
  }

  await softDeleteStadiumService(stadiumId, organizer._id);
};
