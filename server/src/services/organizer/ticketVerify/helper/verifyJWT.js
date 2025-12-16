import jwt from "jsonwebtoken";
import { ENV } from "../../../../config/env.conf.js";
import { AppError } from "../../../../utility/helpers.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { ERRORS } from "../../../../utility/constants/constants.js";

export const verifyJWT = async (qrData) => {
  const payload = jwt.verify(qrData, ENV.QR_DATA_JWT_SECRET);

  console.log(payload)

  if (!payload) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.JWT_PAYLOAD_NOT_FOUND.CODE,
      ERRORS.JWT_PAYLOAD_NOT_FOUND.MSG
    );
  }

  return payload;
};
