import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { streamRoutes } from "./routes/stream";
import { scheduleRoutes } from "./routes/schedules";
import { libraryRoutes } from "./routes/library";
import { productsRoutes } from "./routes/products";
import { ordersRoutes } from "./routes/orders";
import { uploadRoutes } from "./routes/upload";
import { errorHandler } from "./middleware/error-handler";
import { db, schema } from "@suara-nabawiy/db";
import { count } from "drizzle-orm";

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

// Stats endpoint — counts for dashboard overview
app.get("/stats", async (c) => {
  try {
    const [productCount, audioCount, scheduleCount, orderCount] =
      await Promise.all([
        db.select({ value: count() }).from(schema.products),
        db.select({ value: count() }).from(schema.audioLibrary),
        db.select({ value: count() }).from(schema.schedules),
        db.select({ value: count() }).from(schema.orders),
      ]);

    return c.json({
      success: true,
      data: {
        products: productCount[0]?.value ?? 0,
        audio: audioCount[0]?.value ?? 0,
        schedules: scheduleCount[0]?.value ?? 0,
        orders: orderCount[0]?.value ?? 0,
      },
    });
  } catch (error) {
    return c.json(
      { success: false, error: { message: "Failed to fetch stats" } },
      500
    );
  }
});

// Route modules
app.route("/stream", streamRoutes);
app.route("/schedules", scheduleRoutes);
app.route("/library", libraryRoutes);
app.route("/products", productsRoutes);
app.route("/orders", ordersRoutes);
app.route("/upload", uploadRoutes);

export { app };
