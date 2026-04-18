# Coding Rules — Suara Nabawiy

## 1. Aturan Umum

- Semua kode ditulis dalam **TypeScript strict mode** — tidak boleh ada `any` type.
- Semua API request/response harus divalidasi dengan **Zod schema**.
- Gunakan **Drizzle ORM** untuk semua interaksi database. Hindari raw SQL kecuali sangat diperlukan.
- Tidak boleh ada `console.log()` di production code — gunakan logging library yang proper.
- Hindari magic numbers/strings. Gunakan constants atau environment variables.

## 2. Konvensi Penamaan

| Jenis              | Konvensi         | Contoh                              |
| ------------------- | ---------------- | ----------------------------------- |
| File (component)    | `kebab-case`     | `radio-player.tsx`                  |
| File (utility)      | `camelCase`      | `formatDate.ts`                     |
| Component           | `PascalCase`     | `RadioPlayer`, `ScheduleCard`       |
| Variable/Function   | `camelCase`      | `streamUrl`, `fetchSchedules()`     |
| Constant            | `UPPER_SNAKE`    | `API_BASE_URL`, `MAX_RETRIES`       |
| Type/Interface      | `PascalCase`     | `Schedule`, `ProductResponse`       |
| Zod Schema          | `camelCase`      | `createOrderSchema`                 |
| DB Table (Drizzle)  | `snake_case`     | `audio_library`, `order_items`      |
| API Route           | `kebab-case`     | `/api/v1/stream/metadata`           |
| Environment Var     | `UPPER_SNAKE`    | `DATABASE_URL`, `STREAM_URL`        |

## 3. Aturan UI/UX

- Gunakan **Shadcn UI** sebagai component library utama.
- **Tailwind CSS** untuk styling — tidak boleh ada inline CSS atau CSS module kecuali diperlukan.
- **Dark Mode** sebagai tema default dan utama.
- Selalu prioritaskan tampilan **Minimalist Dark Mode** yang bersih dan elegan.
- Semua interactive element harus memiliki hover state, focus state, dan loading state.
- Gunakan animasi yang subtle dan tidak mengganggu (Framer Motion jika diperlukan).
- UI harus **responsive** — mobile-first approach.

## 4. Aturan Backend (Hono.js)

- Semua endpoint harus bersifat **RESTful** dengan naming yang konsisten.
- Setiap endpoint wajib memiliki **error handling** yang konsisten:
  ```typescript
  // ✅ Response format yang benar
  { success: true, data: { ... } }
  { success: false, error: { message: "...", code: "..." } }
  ```
- Gunakan HTTP status code yang tepat (200, 201, 400, 401, 404, 500).
- Input validation menggunakan **Zod** di setiap endpoint.
- Pisahkan business logic dari route handler — gunakan service layer.

## 5. Aturan Database (Drizzle ORM)

- Schema didefinisikan di dalam `/packages/db`.
- Setiap perubahan schema harus menggunakan **migration** (bukan push langsung).
- Relasi antar tabel harus didefinisikan secara eksplisit di Drizzle schema.
- Gunakan **transaction** untuk operasi yang melibatkan multiple table (contoh: checkout).
- Index kolom yang sering digunakan untuk query/filter.

## 6. Aturan Streaming

- Radio player **WAJIB** persistent — tidak boleh re-mount saat navigasi halaman.
- Player component ditempatkan di **root layout** Next.js App Router.
- Metadata streaming (judul, pembicara) harus di-fetch secara real-time menggunakan polling atau WebSocket.
- Handle error koneksi stream dengan graceful fallback dan retry mechanism.
- Audio playback harus dikelola melalui state management global (Zustand atau Context).

## 7. Aturan E-commerce

- Semua operasi yang mengubah stok harus menggunakan **database transaction**.
- Validasi stok produk di **server-side** sebelum memproses order.
- Harga produk tidak boleh di-hardcode di frontend — selalu fetch dari API.
- Gambar produk disimpan di **Cloudflare R2 / S3**, bukan di database.
- Sanitasi semua user input sebelum simpan ke database.

## 8. Aturan Error Handling

- Setiap error harus di-catch dan ditangani — tidak boleh ada unhandled rejection/exception.
- Error message untuk user harus **user-friendly** dalam Bahasa Indonesia.
- Error teknis di-log ke server, bukan ditampilkan ke user.
- Format error response API harus konsisten:
  ```typescript
  {
    success: false,
    error: {
      message: "Produk tidak ditemukan",
      code: "PRODUCT_NOT_FOUND"
    }
  }
  ```

## 9. Aturan Testing

- Setiap API endpoint wajib memiliki integration test.
- Gunakan **Vitest** sebagai test framework.
- Test harus mencakup: happy path, error path, dan edge case.
- Target code coverage: **minimal 80%** untuk business logic.
- Mock external service (payment gateway, storage) saat testing.

## 10. Aturan Git & Versioning

- Commit message menggunakan **Conventional Commits**:
  - `feat:` fitur baru
  - `fix:` perbaikan bug
  - `refactor:` refactoring tanpa mengubah behavior
  - `test:` penambahan/perbaikan test
  - `docs:` perubahan dokumentasi
  - `chore:` maintenance (deps update, config)
  - `style:` perubahan formatting/styling
- Setiap commit harus lolos type-check dan linter sebelum di-push.

## 11. Larangan (Don'ts)

- ❌ Jangan gunakan `any` type — selalu definisikan tipe yang tepat.
- ❌ Jangan tulis raw SQL — gunakan Drizzle ORM query builder.
- ❌ Jangan hardcode secret/credential — gunakan environment variable.
- ❌ Jangan fetch data di client-side jika bisa dilakukan di Server Component.
- ❌ Jangan buat API endpoint tanpa validasi input (Zod).
- ❌ Jangan manipulasi DOM secara langsung — gunakan React state/ref.
- ❌ Jangan simpan file upload di local filesystem — gunakan object storage (R2/S3).
- ❌ Jangan biarkan TODO tanpa deskripsi dan assignee.
