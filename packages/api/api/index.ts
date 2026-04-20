import { handle } from "hono/vercel";
import "../src/env";
import { app } from "../src/app";

// Default export untuk Vercel Serverless Functions
export default handle(app);
