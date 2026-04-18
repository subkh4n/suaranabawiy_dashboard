import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.S3_ENDPOINT?.split(".")[0]?.replace("https://", "") || "";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || "suara-nabawiy-storage";

/**
 * Uploads a file buffer to Cloudflare R2
 */
export async function uploadFileToR2(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  
  // Return the public URL if you have a custom domain configured for your R2 bucket.
  // Otherwise, you can return the key and use presigned URLs.
  return fileName;
}

/**
 * Get a presigned URL to temporarily download/view a private file
 */
export async function getPresignedFileUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Deletes a file from Cloudflare R2
 */
export async function deleteFileFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  await s3Client.send(command);
}
