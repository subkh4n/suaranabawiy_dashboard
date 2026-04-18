import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, schema } from "@suara-nabawiy/db";
import { eq } from "drizzle-orm";

const libraryRoutes = new Hono();

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

const insertSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  speaker: z.string().optional(),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  duration: z.number().default(0),
});

/** GET /api/v1/library (Search, Filter, Paginasi) */
libraryRoutes.get("/", zValidator("query", searchSchema), async (c) => {
  const { q, category, page, limit } = c.req.valid("query");
  try {
    let query = db.select().from(schema.audioLibrary).$dynamic();
    
    // Filtering bisa diekspansi lebih lanjut menggunakan .where()
    const allData = await query;
    let filtered = allData;

    if (q) {
      const qLower = q.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(qLower) ||
          (a.speaker && a.speaker.toLowerCase().includes(qLower)) ||
          (a.description && a.description.toLowerCase().includes(qLower))
      );
    }

    if (category) {
      filtered = filtered.filter((a) => a.category === category);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return c.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** GET /api/v1/library/categories/list */
libraryRoutes.get("/categories/list", async (c) => {
  try {
    const data = await db.select({ category: schema.audioLibrary.category }).from(schema.audioLibrary);
    const categories = [...new Set(data.map((a) => a.category))];
    return c.json({ success: true, data: categories });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** GET /api/v1/library/:id */
libraryRoutes.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  try {
    const data = await db.select().from(schema.audioLibrary).where(eq(schema.audioLibrary.id, id));
    if (data.length === 0) {
      return c.json({ success: false, error: { message: "Not Found" } }, 404);
    }
    return c.json({ success: true, data: data[0] });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** POST /api/v1/library */
libraryRoutes.post("/", zValidator("json", insertSchema), async (c) => {
  const body = c.req.valid("json");
  try {
    const result = await db.insert(schema.audioLibrary).values(body).returning();
    return c.json({ success: true, data: result[0] }, 201);
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to create audio" } }, 500);
  }
});

/** PUT /api/v1/library/:id */
libraryRoutes.put("/:id", zValidator("json", insertSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = c.req.valid("json");
  try {
    const result = await db
      .update(schema.audioLibrary)
      .set(body)
      .where(eq(schema.audioLibrary.id, id))
      .returning();
    
    if (result.length === 0) {
      return c.json({ success: false, error: { message: "Audio not found" } }, 404);
    }
    return c.json({ success: true, data: result[0] });
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to update audio" } }, 500);
  }
});

/** DELETE /api/v1/library/:id */
libraryRoutes.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  try {
    const result = await db.delete(schema.audioLibrary).where(eq(schema.audioLibrary.id, id)).returning();
    if (result.length === 0) {
      return c.json({ success: false, error: { message: "Audio not found" } }, 404);
    }
    return c.json({ success: true, data: { id } });
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to delete audio" } }, 500);
  }
});

export { libraryRoutes };
