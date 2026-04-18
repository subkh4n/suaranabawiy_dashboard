import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Koneksi database PostgreSQL menggunakan Drizzle ORM.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "⚠️  DATABASE_URL belum dikonfigurasi. Database tidak akan terhubung."
  );
}

/** Client PostgreSQL */
const client = connectionString
  ? postgres(connectionString, { max: 10 })
  : (null as unknown as ReturnType<typeof postgres>);

/** Instance Drizzle ORM dengan schema */
export const db = client
  ? drizzle(client, { schema })
  : (null as unknown as ReturnType<typeof drizzle>);

export { schema };
