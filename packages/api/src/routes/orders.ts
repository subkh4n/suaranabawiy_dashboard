import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db, schema } from "@suara-nabawiy/db";
import { eq } from "drizzle-orm";

const ordersRoutes = new Hono();

const insertSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  totalAmount: z.number().min(0),
  status: z.enum(["pending", "paid", "shipped", "completed", "cancelled"]).default("pending"),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "completed", "cancelled"]),
});

/** GET /api/v1/orders */
ordersRoutes.get("/", async (c) => {
  try {
    const data = await db.select().from(schema.orders);
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, error: { message: "Internal Error" } }, 500);
  }
});

/** POST /api/v1/orders (Create Order & Items) */
ordersRoutes.post("/", zValidator("json", insertSchema), async (c) => {
  const body = c.req.valid("json");
  
  try {
    // Basic transaction concept
    const { items, ...orderData } = body;
    
    // Create order
    const orderResult = await db.insert(schema.orders).values(orderData).returning();
    const newOrder = orderResult[0];
    if (!newOrder) {
      throw new Error("Failed to create order");
    }
    const orderId = newOrder.id;
    
    // Insert items
    const orderItemsPayload = items.map(item => ({
      orderId,
      ...item
    }));
    await db.insert(schema.orderItems).values(orderItemsPayload);
    
    return c.json({ success: true, data: newOrder }, 201);
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to create order" } }, 500);
  }
});

/** PATCH /api/v1/orders/:id/status */
ordersRoutes.patch("/:id/status", zValidator("json", updateStatusSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const { status } = c.req.valid("json");
  try {
    const result = await db
      .update(schema.orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();
    
    if (result.length === 0) {
      return c.json({ success: false, error: { message: "Order not found" } }, 404);
    }
    return c.json({ success: true, data: result[0] });
  } catch (error) {
    return c.json({ success: false, error: { message: "Failed to update order status" } }, 500);
  }
});

export { ordersRoutes };
