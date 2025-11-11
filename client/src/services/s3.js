import { api } from "./api/axiosSetup";
import axios from 'axios'

export const generateUploadUrl = async ({
  fileName,
  contentType,
  folderName,
}) => {
  const res = await api.get("/s3/get-upload-signed-url", {
    params: {
      fileName,
      contentType,
      folderName,
    },
  });

  return res.data;
};

export const uploadFile = async ({ file, contentType, signedUrl }) => {
  await axios.put(signedUrl, file, {
    headers: { "Content-Type": contentType },
  });
};
