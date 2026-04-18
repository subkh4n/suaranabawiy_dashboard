import { serve } from "@hono/node-server";
import { app } from "./app";

/** Port dari environment variable atau default 3002 */
const PORT = parseInt(process.env.API_PORT ?? "3002", 10);

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`🚀 Suara Nabawiy API berjalan di http://localhost:${info.port}`);
  }
);

export { app };
