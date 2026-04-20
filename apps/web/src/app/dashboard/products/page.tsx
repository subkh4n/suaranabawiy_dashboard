import { db } from "@suara-nabawiy/db";
import { products } from "@suara-nabawiy/db/schema/products";
import { desc } from "drizzle-orm";
import { ProductManager } from "@/components/dashboard/product-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Produk | Dashboard Admin",
};

export default async function ProductsDashboardPage() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  // Map to the interface expected by the client component
  const safeProducts = allProducts.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    stock: p.stock,
    category: p.category ?? "Lainnya",
    slug: p.slug
  }));

  return <ProductManager initialProducts={safeProducts} />;
}
