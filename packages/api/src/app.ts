import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { streamRoutes } from "./routes/stream";
import { scheduleRoutes } from "./routes/schedules";
import { libraryRoutes } from "./routes/library";
import { productsRoutes } from "./routes/products";
import { ordersRoutes } from "./routes/orders";
import { errorHandler } from "./middleware/error-handler";

/** Aplikasi utama Hono.js */
const app = new Hono().basePath("/api/v1");

// Middleware global
app.use("*", logger());
app.use("*", cors());
app.onError(errorHandler);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    success: true,
    data: {
      status: "healthy",
      service: "suara-nabawiy-api",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    },
  });
});

// Route modules
app.route("/stream", streamRoutes);
app.route("/schedules", scheduleRoutes);
app.route("/library", libraryRoutes);
app.route("/products", productsRoutes);
app.route("/orders", ordersRoutes);

export { app };
