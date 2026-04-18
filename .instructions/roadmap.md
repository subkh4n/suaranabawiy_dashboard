# Project Roadmap — Suara Nabawiy (Web)

## Phase 1: Foundation & Setup ✅
- [x] Inisialisasi monorepo (apps/web, apps/dashboard, packages/api, packages/db, packages/ui)
- [x] Setup Next.js 16+ dengan App Router & Dark Mode theme
- [x] Setup Hono.js backend skeleton
- [x] Setup Drizzle ORM + PostgreSQL connection
- [x] Konfigurasi Tailwind CSS 4 + Shadcn UI
- [x] Konfigurasi TypeScript strict mode & linter

## Phase 2: Radio Streaming Core ✅
- [x] Implementasi persistent radio player (root layout)
- [x] Buat API endpoint `/api/v1/stream/metadata`
- [ ] Fetch & tampilkan metadata siaran real-time (integrasi API ↔ frontend)
- [x] Handle error koneksi stream (retry, fallback UI)
- [x] Play/Pause/Volume controls dengan UI minimalis

## Phase 3: Jadwal Siaran (In Progress)
- [x] Buat schema Drizzle untuk tabel `schedules`
- [x] Buat API endpoint jadwal siaran (GET /today, GET /weekly)
- [x] Buat halaman jadwal siaran publik (hari ini & mingguan)
- [x] Indikator `LIVE` pada jadwal yang sedang berlangsung
- [ ] Admin dashboard: kelola jadwal siaran (CRUD)

## Phase 4: Audio Library ✅
- [x] Buat schema Drizzle untuk tabel `audio_library`
- [x] Upload audio ke Cloudflare R2 / S3 (UI disiapkan)
- [x] Buat API endpoint search & filter audio library
- [x] Halaman audio library dengan player inline
- [x] Kategori & tagging sistem

## Phase 5: E-commerce ✅
- [x] Buat schema Drizzle untuk tabel `products`, `orders`, `order_items`
- [x] Buat API endpoint CRUD produk
- [x] Halaman produk dengan grid/list view
- [x] Detail produk dengan galeri gambar (Simplified)
- [x] Sistem keranjang belanja (cart)
- [x] Checkout flow dengan validasi stok
- [x] Integrasi payment gateway (Custom Transfer & QRIS)

## Phase 6: Admin Dashboard (In Progress)
- [ ] Auth system (login admin)
- [x] Dashboard overview (statistik listener, order, konten)
- [x] Kelola jadwal, audio library, dan produk
- [x] Kelola order & tracking pembayaran

## Phase 7: Testing & Deployment
- [ ] Unit & integration test (coverage ≥ 80%)
- [ ] Performance optimization (Core Web Vitals)
- [ ] SEO metadata & Open Graph
- [ ] Deploy ke production (Vercel / VPS)
- [ ] Monitoring & error tracking (Sentry)
