import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, schema } from "@suara-nabawiy/db";
import { eq } from "drizzle-orm";

const productsRoutes = new Hono();

const insertSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().min(0),
  images: z.array(z.string()).optional(),
  slug: z.string().min(1),
  category: z.string().optional(),
});

/** GET /api/v1/products */
productsRoutes.get("/", async (c) => {
  try {
    const data = await db.select().from(schema.products);
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** GET /api/v1/products/:slug */
productsRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  try {
    const data = await db.select().from(schema.products).where(eq(schema.products.slug, slug));
    if (data.length === 0) {
      return c.json({ success: false, error: { message: "Product not found" } }, 404);
    }
    return c.json({ success: true, data: data[0] });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** POST /api/v1/products */
productsRoutes.post("/", zValidator("json", insertSchema), async (c) => {
  const body = c.req.valid("json");
  try {
    const payload = { ...body, images: body.images || [] };
    const result = await db.insert(schema.products).values(payload).returning();
    return c.json({ success: true, data: result[0] }, 201);
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to create product" } }, 500);
  }
});

/** PUT /api/v1/products/:id */
productsRoutes.put("/:id", zValidator("json", insertSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const body = c.req.valid("json");
  try {
    const payload = { ...body, images: body.images || [], updatedAt: new Date() };
    const result = await db
      .update(schema.products)
      .set(payload)
      .where(eq(schema.products.id, id))
      .returning();
    
    if (result.length === 0) {
      return c.json({ success: false, error: { message: "Product not found" } }, 404);
    }
    return c.json({ success: true, data: result[0] });
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to update product" } }, 500);
  }
});

/** DELETE /api/v1/products/:id */
productsRoutes.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  try {
    const result = await db.delete(schema.products).where(eq(schema.products.id, id)).returning();
    if (result.length === 0) {
      return c.json({ success: false, error: { message: "Product not found" } }, 404);
    }
    return c.json({ success: true, data: { id } });
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to delete product" } }, 500);
  }
});

export { productsRoutes };
