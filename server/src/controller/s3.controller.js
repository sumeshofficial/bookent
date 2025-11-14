import { putObject } from "../services/s3.service.js";
import { statusCode } from "../utility/constants.js";

// AWS S3 upload files
export const uploadFiles = async (req, res) => {
  try {
    const { fileName, contentType, folderName } = req.query;

    if (!fileName || !contentType || !folderName) {
      return res.status(statusCode.missingField).json({
        success: false,
        message: "Missing field",
      });
    }

    const { signedUrl, key } = await putObject({
      fileName,
      contentType,
      folderName,
    });

    res.status(statusCode.created).json({
      success: true,
      message: "Url created successfully",
      signedUrl,
      key,
    });
  } catch (error) {
    res.status(statusCode.serverError).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};
