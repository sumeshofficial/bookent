import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const region = process.env.AWS_BUCKET_REGION;
const expiresIn = process.env.AWS_SIGNED_URI_EXPIRES_IN;

// AWS S3 bucket client
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// AWS S3 bucket create signed URL for getObject
export const getObjectURL = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
};

// AWS S3 bucket create signed URL for putObject
export const putObject = async ({ fileName, contentType, folderName }) => {
  const key = `uploads/${folderName}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return { signedUrl, key };
};

// AWS S3 bucket delete object
export const deleteObject = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};
