# Agent Skills — Suara Nabawiy

Daftar kemampuan teknis yang dimiliki agent untuk membangun dan memelihara aplikasi Suara Nabawiy.

---

## Skill 1: `generate_schema`

**Deskripsi**: Membuat schema Drizzle ORM berdasarkan requirement entitas baru.

**Kemampuan**:
- Mendefinisikan tabel, kolom, tipe data, dan constraint di Drizzle.
- Membuat relasi antar tabel (one-to-many, many-to-many).
- Menghasilkan migration file dari perubahan schema.
- Menambahkan index pada kolom yang sering diquery.

**Contoh Implementasi**:
```typescript
import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  speakerName: text('speaker_name').notNull(),
  isLive: boolean('is_live').default(false),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  stock: integer('stock').notNull().default(0),
  images: jsonb('images').$type<string[]>().default([]),
  slug: text('slug').notNull().unique(),
});
```

---

## Skill 2: `ui_component_builder`

**Deskripsi**: Membuat komponen UI yang responsif dan aksesibel menggunakan Shadcn UI + Tailwind CSS.

**Kemampuan**:
- Membangun komponen reusable dengan Shadcn UI primitives.
- Menerapkan Dark Mode theming yang konsisten.
- Membuat layout responsive (mobile-first).
- Menambahkan animasi subtle dengan Tailwind transitions atau Framer Motion.
- Memastikan aksesibilitas (ARIA labels, keyboard navigation, focus management).

**Contoh Implementasi**:
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleCardProps {
  title: string;
  speaker: string;
  time: string;
  isLive: boolean;
}

export function ScheduleCard({ title, speaker, time, isLive }: ScheduleCardProps) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-zinc-100 text-lg">{title}</CardTitle>
        {isLive && (
          <Badge variant="destructive" className="animate-pulse">
            🔴 LIVE
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400 text-sm">{speaker}</p>
        <p className="text-zinc-500 text-xs mt-1">{time}</p>
      </CardContent>
    </Card>
  );
}
```

---

## Skill 3: `stream_handler`

**Deskripsi**: Mengelola logika radio streaming, metadata, dan sinkronisasi jadwal real-time.

**Kemampuan**:
- Mengonfigurasi HTML5 Audio API atau library streaming untuk playback.
- Fetch metadata siaran saat ini (judul, pembicara) secara real-time.
- Sinkronisasi jadwal siaran dengan status `is_live` di database.
- Implementasi persistent player yang tidak re-mount saat navigasi.
- Handle error koneksi stream dengan retry logic.

**Contoh Implementasi (Persistent Player)**:
```tsx
// app/layout.tsx — Player ditempatkan di root layout
import { RadioPlayer } from "@/components/radio-player";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body>
        <main>{children}</main>
        <RadioPlayer /> {/* Persistent — tidak re-mount saat navigasi */}
      </body>
    </html>
  );
}
```

**Contoh Metadata Fetching**:
```typescript
// hooks/useStreamMetadata.ts
import { useEffect, useState } from "react";

export function useStreamMetadata(intervalMs = 10000) {
  const [metadata, setMetadata] = useState({ title: "", speaker: "" });

  useEffect(() => {
    const fetchMeta = async () => {
      const res = await fetch("/api/v1/stream/metadata");
      const data = await res.json();
      if (data.success) setMetadata(data.data);
    };

    fetchMeta();
    const interval = setInterval(fetchMeta, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return metadata;
}
```

---

## Skill 4: `checkout_logic`

**Deskripsi**: Mengintegrasikan sistem pembayaran dan manajemen stok produk e-commerce.

**Kemampuan**:
- Validasi stok produk sebelum checkout (server-side).
- Membuat order dengan database transaction (atomic operation).
- Mengurangi stok produk setelah order berhasil.
- Integrasi dengan payment gateway (Midtrans / Xendit).
- Handle edge case: stok habis saat checkout, pembayaran gagal, timeout.

**Contoh Implementasi (Checkout dengan Transaction)**:
```typescript
import { db } from "@/packages/db";
import { orders, orderItems, products } from "@/packages/db/schema";
import { eq, sql } from "drizzle-orm";

export async function createOrder(input: CreateOrderInput) {
  return await db.transaction(async (tx) => {
    // 1. Validasi stok
    for (const item of input.items) {
      const product = await tx.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (!product || product.stock < item.quantity) {
        throw new Error(`Stok ${product?.name} tidak mencukupi`);
      }
    }

    // 2. Buat order
    const [order] = await tx.insert(orders).values({
      customerName: input.customerName,
      totalAmount: input.totalAmount,
      status: "pending",
    }).returning();

    // 3. Insert order items & kurangi stok
    for (const item of input.items) {
      await tx.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });

      await tx.update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }

    return order;
  });
}
```

---

## Skill 5: `api_builder`

**Deskripsi**: Membuat API endpoint RESTful menggunakan Hono.js dengan validasi Zod.

**Kemampuan**:
- Membuat CRUD endpoint dengan Hono.js router.
- Validasi request body/params/query dengan Zod.
- Konsisten error handling dengan format response standar.
- Middleware untuk auth, rate-limiting, dan logging.

**Contoh Implementasi**:
```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/packages/db";
import { schedules } from "@/packages/db/schema";

const app = new Hono();

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

app.get("/schedules/today", zValidator("query", querySchema), async (c) => {
  try {
    const today = new Date();
    const result = await db.query.schedules.findMany({
      where: (s, { gte, lte }) =>
        and(gte(s.startTime, startOfDay(today)), lte(s.startTime, endOfDay(today))),
      orderBy: (s) => s.startTime,
    });

    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: { message: "Gagal mengambil jadwal", code: "FETCH_ERROR" } }, 500);
  }
});
```

---

## Skill 6: Testing & Quality Assurance

**Deskripsi**: Menulis dan menjalankan test untuk memastikan kualitas kode.

**Kemampuan**:
- Menulis unit test & integration test dengan **Vitest**.
- Testing API endpoint (request → response validation).
- Mocking database dan external service.
- Menjalankan `tsc --noEmit` untuk type-check.
- Memastikan coverage minimal 80% untuk business logic.

**Contoh API Test**:
```typescript
import { describe, it, expect, vi } from "vitest";
import app from "@/packages/api";

describe("GET /api/v1/schedules/today", () => {
  it("should return today's schedules", async () => {
    const res = await app.request("/api/v1/schedules/today");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("should return 500 on database error", async () => {
    vi.spyOn(db.query.schedules, "findMany").mockRejectedValueOnce(new Error("DB Error"));

    const res = await app.request("/api/v1/schedules/today");
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
  });
});
```

---

## Skill 7: Maintenance & Debugging

**Deskripsi**: Memelihara dan men-debug aplikasi secara efektif.

**Kemampuan**:
- Debugging server-side rendering (SSR) issues di Next.js.
- Profiling performa halaman (Core Web Vitals).
- Mengidentifikasi dan memperbaiki memory leak pada streaming component.
- Monitoring error di production (Sentry / custom logger).
- Mengelola database migration dan rollback.
- Memperbarui dependencies secara aman.
