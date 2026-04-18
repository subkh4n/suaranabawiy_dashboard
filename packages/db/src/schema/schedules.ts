import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Tabel `schedules` — Jadwal siaran radio
 */
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dayOfWeek: text("day_of_week"), // "Senin", "Selasa", etc.
  startTimeOnly: text("start_time_only"), // "HH:mm"
  endTimeOnly: text("end_time_only"),   // "HH:mm"
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  speakerName: text("speaker_name").notNull(),
  isLive: boolean("is_live").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
