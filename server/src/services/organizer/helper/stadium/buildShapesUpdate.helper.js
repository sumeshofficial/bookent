import { deleteObject } from "../../../s3.service.js";

export const buildShapesUpdate = async (payload, existing) => {
  if (!payload?.stadiumLayout?.shapes) {
    return {};
  }

  const newShapes = payload.stadiumLayout.shapes;
  const oldShapes = existing.shapes;

  const finalShapes = [];
  const newIds = newShapes.map((s) => s.id);

  for (const shape of newShapes) {
    const oldShape = oldShapes.find((s) => s.id === shape.id);

    if (oldShape && shape.imageKey && shape.imageKey !== oldShape.imageKey) {
      await deleteObject(oldShape.imageKey);
    }
    finalShapes.push(shape);
  }

  const removed = oldShapes.filter((s) => !newIds.includes(s.id));
  for (const r of removed) {
    if (r.imageKey) {
      await deleteObject(r.imageKey);
    }
  }

  return { shapes: finalShapes };
};
