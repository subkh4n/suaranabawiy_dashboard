# Architecture — Suara Nabawiy

## Tech Stack

| Layer              | Teknologi                                          |
| ------------------ | -------------------------------------------------- |
| **Frontend (Web)** | Next.js 14+ (App Router)                           |
| **Styling**        | Tailwind CSS + Shadcn UI (Dark Mode default)       |
| **Backend API**    | Hono.js (Node.js/Edge runtime)                     |
| **Database**       | SQLite (Cloudflare D1 / libSQL)                    |
| **ORM**            | Drizzle ORM                                        |
| **Validation**     | Zod                                                |
| **Streaming**      | HLS (HTTP Live Streaming) / Icecast               |
| **Storage**        | Cloudflare R2 / AWS S3 (Audio Library)             |
| **Language**       | TypeScript (strict mode)                           |

## Arsitektur Monorepo

```
/apps
  /web              # Next.js Public Website (Radio, Library, Shop)
  /dashboard        # Next.js Admin Panel (Jadwal, Konten, Order)

/packages
  /api              # Hono.js Backend (REST API)
  /db               # Drizzle Schema & Migrations
  /ui               # Shared Shadcn UI Components
```

## Fitur Utama

1. **Radio Streaming** — Live audio player dengan metadata real-time (judul, pembicara).
2. **Audio Library** — Koleksi rekaman kajian dengan pencarian dan filter.
3. **Jadwal Siaran** — Jadwal harian/mingguan yang sinkron dengan siaran live.
4. **E-commerce** — Toko online untuk produk islami (buku, parfum, dll).

## Database Schema Highlights

### `schedules`
```
id, title, description, start_time, end_time, speaker_name, is_live (boolean)
```

### `audio_library`
```
id, title, category, file_url, duration, plays_count, created_at
```

### `products`
```
id, name, description, price, stock, images (text/json), slug, category
```

## API Routes Design

| Method | Endpoint                   | Deskripsi                        |
| ------ | -------------------------- | -------------------------------- |
| GET    | `/api/v1/stream/metadata`  | Info siaran yang sedang diputar  |
| GET    | `/api/v1/schedules/today`  | Jadwal siaran hari ini           |
| GET    | `/api/v1/library`          | Cari & filter koleksi audio      |
| POST   | `/api/v1/orders`           | Proses checkout e-commerce       |

## Persistent Player (Next.js)

Radio player harus **tetap aktif** saat user berpindah halaman. Implementasi menggunakan layout-level component di Next.js App Router:

```
app/
├── layout.tsx          # Root layout → RadioPlayer & CartProvider ditempatkan di sini
├── (main)/
│   ├── page.tsx        # Home
│   ├── library/
│   │   └── page.tsx    # Audio Library
│   ├── shop/
│   │   └── page.tsx    # E-commerce Catalog
│   └── checkout/
│       └── page.tsx    # E-commerce Checkout
```

## Pembayaran & Checkout (E-commerce Phase 5)

Proses _Checkout_ dan _Pembayaran_ pada platform ini di-handle secara kustom tanpa menggunakan payment gateway pihak ketiga (seperti Midtrans/Xendit) untuk saat ini.

- **QRIS Dinamis**: Fitur pembayaran melalui _scan_ QRIS secara langsung. Saat _checkout_, user akan diberikan Dummy QR Code yang mewakili pembayaran untuk Order tersebut.
- **Transfer Bank Manual**: Menyediakan nomor rekening spesifik (contoh: BSI) dan instruksi untuk melakukan pembayaran termasuk mentransfer hingga 3 digit terakhir.

Data order akan tersimpan di tabel `orders` dan `order_items` berstatus `pending` ketika _checkout_ sukses dilakukan.
