import { deleteObject } from "../../../s3.service.js";

export const handleLayoutImage = async (payload, existing) => {
  if (!payload.layoutImageKey) {
    return {};
  }

  if (existing.layoutImageKey) {
    await deleteObject(existing.layoutImageKey);
  }

  return { layoutImageKey: payload.layoutImageKey };
};
