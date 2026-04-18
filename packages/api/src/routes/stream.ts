import { Hono } from "hono";

/**
 * Route: /api/v1/stream
 * Mengelola metadata streaming radio
 */
const streamRoutes = new Hono();

/**
 * GET /api/v1/stream/metadata
 * Mengambil informasi siaran yang sedang diputar
 */
streamRoutes.get("/metadata", (c) => {
  // TODO: Implementasi fetch metadata dari Icecast/HLS source
  return c.json({
    success: true,
    data: {
      title: "Tafsir Surah Al-Fatihah",
      speaker: "Ust. Ahmad Zainuddin, Lc.",
      isLive: true,
      listenerCount: 0,
      streamUrl: process.env.STREAM_URL ?? "",
    },
  });
});

/**
 * GET /api/v1/stream/status
 * Mengecek status koneksi stream
 */
streamRoutes.get("/status", (c) => {
  return c.json({
    success: true,
    data: {
      online: true,
      uptime: 0,
      bitrate: "128kbps",
      format: "audio/mpeg",
    },
  });
});

export { streamRoutes };
