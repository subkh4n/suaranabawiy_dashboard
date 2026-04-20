import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hanya load .env secara manual jika tidak berjalan di Vercel
// Di Vercel, environment variables dikelola via dashboard
if (!process.env.VERCEL) {
  dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
  console.log("✅ Environment variables loaded from root .env");
}
