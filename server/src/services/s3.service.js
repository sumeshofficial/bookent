import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getObjectURL = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);
  return url;
};

export const putObject = async ({ fileName, contentType, folderName }) => {
  const key = `uploads/${folderName}/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return { signedUrl, key };
};
