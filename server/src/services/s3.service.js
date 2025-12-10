import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { ENV } from "../config/envConfig.js";
dotenv.config();

const region = ENV.AWS_BUCKET_REGION;
const expiresIn = ENV.AWS_SIGNED_URI_EXPIRES_IN;

// AWS S3 bucket client
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
});

// AWS S3 bucket create signed URL for getObject
export const getObjectURL = async (key) => {
  const command = new GetObjectCommand({
    Bucket: ENV.AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
};

// AWS S3 bucket create signed URL for putObject
export const putObject = async ({ fileName, contentType, folderName }) => {
  const key = `uploads/${folderName}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: ENV.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return { signedUrl, key };
};

// AWS S3 bucket delete object
export const deleteObject = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: ENV.AWS_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};
