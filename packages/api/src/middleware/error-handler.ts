import type { Context } from "hono";

/**
 * Error Response Type — format konsisten untuk semua error
 * Sesuai rules.md: { success: false, error: { message, code } }
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

/**
 * Global error handler middleware
 * Menangkap semua unhandled error dan mengubahnya ke format response standar
 */
export function errorHandler(err: Error, c: Context): Response {
  // Log error teknis ke server
  console.error(`[API Error] ${err.message}`, {
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  });

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: "Terjadi kesalahan pada server. Silakan coba lagi.",
      code: "INTERNAL_SERVER_ERROR",
    },
  };

  // Deteksi tipe error untuk response yang lebih spesifik
  if (err.message.includes("NOT_FOUND")) {
    errorResponse.error.message = "Data yang diminta tidak ditemukan.";
    errorResponse.error.code = "NOT_FOUND";
    return c.json(errorResponse, 404);
  }

  if (err.message.includes("VALIDATION")) {
    errorResponse.error.message = "Data yang dikirim tidak valid.";
    errorResponse.error.code = "VALIDATION_ERROR";
    return c.json(errorResponse, 400);
  }

  return c.json(errorResponse, 500);
}
