import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Koneksi database PostgreSQL menggunakan Drizzle ORM.
 */

const connectionString = process.env.DATABASE_URL;

/** Client PostgreSQL */
const client = connectionString
  ? postgres(connectionString, { max: 10, ssl: "require" })
  : (null as unknown as ReturnType<typeof postgres>);

/** Instance Drizzle ORM dengan schema */
export const db = client
  ? drizzle(client, { schema })
  : (null as unknown as ReturnType<typeof drizzle>);

if (!connectionString) {
  console.warn(
    "⚠️  DATABASE_URL belum dikonfigurasi. Database tidak akan terhubung."
  );
}

export * as schema from "./schema";
export * from "./schema";
