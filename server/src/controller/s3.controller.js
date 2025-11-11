import { putObject } from "../services/s3.service.js";

export const uploadFiles = async (req, res) => {
  try {
    const { fileName, contentType, folderName } = req.query;

    if (!fileName || !contentType || !folderName) {
      return res.status(422).json({
        success: false,
        message: "Missing field",
      });
    }

    const { signedUrl, key } = await putObject({ fileName, contentType, folderName });

    res.status(201).json({
      success: true,
      message: "Url created successfully",
      signedUrl,
      key,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};
