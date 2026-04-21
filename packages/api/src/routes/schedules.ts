import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, schema } from "@suara-nabawiy/db";
import { eq } from "drizzle-orm";

const scheduleRoutes = new Hono();

/** Schema validasi insert/update */
const insertSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dayOfWeek: z.string().optional(),
  startTimeOnly: z.string().optional(),
  endTimeOnly: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  speakerName: z.string().min(1),
  isLive: z.boolean().default(false),
});

/** Schema query pencarian */
const querySchema = z.object({
  date: z.string().optional(),
});

/** GET /api/v1/schedules — List all schedules */
scheduleRoutes.get("/", async (c) => {
  try {
    const data = await db.select().from(schema.schedules);
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** GET /api/v1/schedules/today */
scheduleRoutes.get("/today", zValidator("query", querySchema), async (c) => {
  try {
    const data = await db.select().from(schema.schedules);
    // TODO: Tambahkan filter berdasarkan date jika dibutuhkan nanti menggunakan where
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** GET /api/v1/schedules/weekly */
scheduleRoutes.get("/weekly", async (c) => {
  try {
    const data = await db.select().from(schema.schedules);
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** POST /api/v1/schedules */
scheduleRoutes.post("/", zValidator("json", insertSchema), async (c) => {
  const body = c.req.valid("json");
  try {
    const result = await db.insert(schema.schedules).values(body).returning();
    return c.json({ success: true, data: result[0] }, 201);
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to create schedule" } }, 500);
  }
});

/** PUT /api/v1/schedules/:id */
scheduleRoutes.put("/:id", zValidator("json", insertSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = c.req.valid("json");
  try {
    const result = await db
      .update(schema.schedules)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(schema.schedules.id, id))
      .returning();
    
    if (result.length === 0) {
      return c.json({ success: false, error: { message: "Schedule not found" } }, 404);
    }
    return c.json({ success: true, data: result[0] });
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to update schedule" } }, 500);
  }
});

/** DELETE /api/v1/schedules/:id */
scheduleRoutes.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  try {
    const result = await db.delete(schema.schedules).where(eq(schema.schedules.id, id)).returning();
    if (result.length === 0) {
      return c.json({ success: false, error: { message: "Schedule not found" } }, 404);
    }
    return c.json({ success: true, data: { id } });
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to delete schedule" } }, 500);
  }
});

export { scheduleRoutes };
