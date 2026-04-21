import { getProducts } from "@/lib/api-client";
import { ProductManager } from "@/components/dashboard/product-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Produk | Dashboard Admin",
};

export default async function ProductsDashboardPage() {
  let safeProducts: any[] = [];

  try {
    const allProducts = await getProducts();
    const sortedProducts = [...allProducts].sort((a, b) => b.id - a.id);

    // Map to the interface expected by the client component
    safeProducts = sortedProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      stock: p.stock,
      category: p.category ?? "Lainnya",
      slug: p.slug
    }));
  } catch (error) {
    console.error("Failed to fetch products for dashboard", error);
  }

  return <ProductManager initialProducts={safeProducts} />;
}
