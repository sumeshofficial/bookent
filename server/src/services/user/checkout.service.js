import { redisClient } from "../../config/redis.conf";
import Event from "../../models/event.model";
import Stadium from "../../models/stadium.model";
import { ERRORS, STATUS_CODE } from "../../utility/constants";
import { AppError } from "../../utility/helpers";
import dotenv from "dotenv";
dotenv.config();

const LOCK_TTL_EXTEND = process.env.LOCK_TTL_EXTEND;

export const checkPageDetails = async (lockId, userId) => {
  const meta = await redisClient.hGetAll(`lockmeta:${lockId}`);

  if (!meta || !meta.eventId) {
    throw new AppError(
      STATUS_CODE.GONE,
      ERRORS.LOCK_EXPIRED.CODE,
      ERRORS.LOCK_EXPIRED.MSG
    );
  }

  const lockKey = `lock:${meta.eventId}:${meta.sectionId}:${lockId}`;
  const exists = await redisClient.exists(lockKey);

  await redisClient.expire(lockKey, LOCK_TTL_EXTEND);
  await redisClient.expire(`lockmeta:${lockId}`, LOCK_TTL_EXTEND);

  if (!exists) {
    throw new AppError(
      STATUS_CODE.GONE,
      ERRORS.LOCK_NOT_FOUND.CODE,
      ERRORS.LOCK_NOT_FOUND.MSG
    );
  }

  if (meta.userId !== userId.toString()) {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      "UNAUTHORIZED_ACCESS",
      "You are not allowed to use this lock."
    );
  }

  const event = await Event.findById(meta.eventId).lean();
  if (!event) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "EVENT_NOT_FOUND",
      "Event not found."
    );
  }

  const stadium = await Stadium.findById(event.stadium).lean();
  if (!stadium) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "STADIUM_NOT_FOUND",
      "Stadium not found."
    );
  }

  const sectionShape = stadium.shapes?.find(
    (shape) => shape.id === meta.sectionId
  );

  if (!sectionShape) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "SECTION_NOT_FOUND",
      "Section not found in stadium layout."
    );
  }

  return {
    lockId,
    qty: Number(meta.qty),
    event: {
      _id: event._id,
      title: event.eventTitle,
      date: event.matchDate,
      venue: event.stadiumAddress,
      time: event.matchTime,
    },
    section: {
      _id: sectionShape.id,
      name: sectionShape.title,
      price: sectionShape.price,
    },
  };
};
