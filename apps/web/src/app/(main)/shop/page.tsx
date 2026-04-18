import { ShoppingBag } from "lucide-react";
import { db, schema } from "@suara-nabawiy/db";
import { ProductGrid } from "@/components/shop/product-grid";

export const dynamic = "force-dynamic";

/**
 * Halaman Toko Islami (Server Component)
 * Mengambil data langsung dari Neon Database menggunakan @suara-nabawiy/db
 */
export default async function ShopPage() {
  let products: any[] = [];
  let error: string | null = null;

  try {
    // Fetch directly from Neon via Drizzle
    products = await db.select().from(schema.products);
  } catch (err: any) {
    console.error("Database Error:", err);
    error = err.message;
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10">
            <ShoppingBag className="h-6 w-6 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Toko Islami</h1>
            <p className="text-muted-foreground">
              Buku, parfum, dan produk islami pilihan untuk menunjang ibadah Anda.
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
            <p>Gagal memuat produk dari database.</p>
            <p className="text-xs opacity-70 mt-1">({error})</p>
          </div>
        ) : (
          <ProductGrid initialProducts={products} />
        )}
      </div>
    </div>
  );
}
