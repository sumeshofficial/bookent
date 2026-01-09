import { getObjectURL, putObject } from "../services/s3.service.js";
import { STATUS_CODE } from "../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../utility/helpers.js";
import { ERRORS } from "../utility/constants/constants.js";

// AWS S3 upload files
export const uploadFiles = asyncHandler(async (req, res) => {
  const { fileName, contentType, folderName } = req.query;

  if (!fileName || !contentType || !folderName) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const { signedUrl, key } = await putObject({
    fileName,
    contentType,
    folderName,
  });

  sendResponse(res, { signedUrl, key }, STATUS_CODE.CREATED);
});

export const getFiles = asyncHandler(async (req, res) => {
  const { key } = req.query;

  if (!key) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const imageUrl = await getObjectURL(key);

  sendResponse(res, imageUrl, STATUS_CODE.CREATED);
});
