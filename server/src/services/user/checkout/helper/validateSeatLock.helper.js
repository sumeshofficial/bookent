import {
  getAllHashFields,
  isDataExists,
} from "../../../../repositories/user/redis.repository.js";
import { ERRORS, STATUS_CODE } from "../../../../utility/constants.js";
import { AppError } from "../../../../utility/helpers.js";

export const validateSeatLock = async (lockId, userId) => {
  const meta = await getAllHashFields(`lockmeta:${lockId}`);

  if (!meta || !meta.eventId) {
    throw new AppError(
      STATUS_CODE.GONE,
      ERRORS.LOCK_EXPIRED.CODE,
      ERRORS.LOCK_EXPIRED.MSG
    );
  }

  const lockKey = `lock:${meta.eventId}:${meta.sectionId}:${lockId}`;
  const exists = await isDataExists(lockKey);

  if (!exists) {
    throw new AppError(
      STATUS_CODE.GONE,
      ERRORS.LOCK_NOT_FOUND.CODE,
      ERRORS.LOCK_NOT_FOUND.MSG
    );
  }

  if (meta.userId !== userId.toString()) {
    throw new AppError(
      STATUS_CODE.GONE,
      ERRORS.UNAUTHORIZED_ACCESS.CODE,
      ERRORS.UNAUTHORIZED_ACCESS.MSG
    );
  }

  return meta;
};
