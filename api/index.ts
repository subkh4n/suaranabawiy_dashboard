import { handle } from "hono/vercel";
import "../packages/api/src/env";
import { app } from "../packages/api/src/app";

/**
 * Vercel Serverless Function entry point.
 * File ini harus berada di /api/ root agar Vercel otomatis
 * mendeteksi dan mem-bundle sebagai serverless function.
 */
export default handle(app);
