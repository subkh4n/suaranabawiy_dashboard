import { Hono } from "hono";
import { uploadFileToR2 } from "../lib/s3";

export const uploadRoutes = new Hono();

const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  // Video
  "video/mp4",
  "video/webm",
];

uploadRoutes.post("/", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"];

    if (!file || typeof file === "string") {
      return c.json(
        { success: false, error: "File tidak ditemukan dalam request form-data" },
        400
      );
    }

    // `file` is an instance of File (web standard)
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return c.json(
        {
          success: false,
          error: "Tipe file tidak diizinkan. Hanya gambar, audio, dan video yang diperbolehkan.",
        },
        400
      );
    }

    const maxFileSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxFileSize) {
      return c.json({ success: false, error: "Ukuran file terlalu besar (Max: 50MB)" }, 400);
    }

    // Read the array buffer from the Web File API object
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename to avoid collision
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${fileExtension}`;

    // Upload to s3 (Cloudflare R2)
    const storedFileName = await uploadFileToR2(buffer, uniqueFileName, file.type);

    // R2 endpoint formatting for public assets
    // Since R2 uses public buckets usually paired with a custom domain, 
    // we structure the URL if a custom domain or bucket url logic applies.
    // Ideally user provides NEXT_PUBLIC_BUCKET_URL in the frontend. 
    // Here we return the final file key identifier or a full URL if determinable.
    const accountId = process.env.S3_ENDPOINT?.split(".")[0]?.replace("https://", "") || "";
    const publicUrl = `https://pub-${accountId}.r2.dev/${storedFileName}`; 
    // ^ Replace later if user binds a custom domain `https://media.suaranabawiy.com`

    return c.json({
      success: true,
      data: {
        key: storedFileName,
        url: publicUrl,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return c.json({ success: false, error: "Gagal mengunggah file" }, 500);
  }
});
