import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Koneksi database PostgreSQL menggunakan Drizzle ORM.
 * Inisialisasi dilakukan secara lazy — hanya saat pertama kali digunakan.
 * Ini mencegah crash saat build di Vercel ketika DATABASE_URL belum tersedia.
 */

let _db: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        "⚠️ DATABASE_URL belum dikonfigurasi. Pastikan environment variable sudah di-set."
      );
    }

    const client = postgres(connectionString, { max: 10 });
    _db = drizzle(client, { schema });
  }

  return _db;
}

/**
 * Proxy yang men-forward semua akses ke instance Drizzle yang di-lazy-init.
 * Ini memungkinkan `import { db } from "@suara-nabawiy/db"` bekerja
 * tanpa crash saat module di-evaluate (build time).
 */
export const db: PostgresJsDatabase<typeof schema> = new Proxy(
  {} as PostgresJsDatabase<typeof schema>,
  {
    get(_target, prop, receiver) {
      const realDb = getDb();
      const value = Reflect.get(realDb, prop, receiver);
      if (typeof value === "function") {
        return value.bind(realDb);
      }
      return value;
    },
  }
);

export * as schema from "./schema";
export * from "./schema";
