import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Tabel `audio_library` — Koleksi rekaman kajian
 */
export const audioLibrary = pgTable("audio_library", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  speaker: text("speaker"),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  duration: integer("duration").notNull().default(0), // Durasi dalam detik
  playsCount: integer("plays_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
