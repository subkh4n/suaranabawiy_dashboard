"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ShoppingCart, Loader2 } from "lucide-react";
import { useCart, CartItem } from "@/context/cart-context";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  slug: string;
  category: string;
  images: string[];
}

/** Format harga ke Rupiah */
function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ep-little-bird-ao5f9s9j.apirest.c-2.ap-southeast-1.aws.neon.tech/neondb/rest/v1";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error("Gagal mengambil data produk");
        const data = await res.json();
        
        // parse JSON string on images if needed (Data API usually returns them correctly)
        const parsedData = data.map((p: any) => ({
          ...p,
          images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
        }));
        setProducts(parsedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
    };
    addToCart(item);
  };

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

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3">Memuat produk...</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
            <p>Gagal memuat produk. Sistem dalam perbaikan.</p>
            <p className="text-xs opacity-70 mt-1">({error})</p>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p>Belum ada produk tersedia saat ini.</p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-brand-primary/50 hover:shadow-lg hover:shadow-brand-primary/5"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full bg-secondary">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                    <ShoppingBag className="h-16 w-16" />
                  </div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-black backdrop-blur-sm">
                    Sisa {product.stock}
                  </span>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <span className="font-bold text-white">Habis</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center justify-between">
                  {product.category && (
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {product.category}
                    </span>
                  )}
                </div>
                <h3 className="mb-1 font-semibold leading-tight line-clamp-2">
                  {product.name}
                </h3>
                <p className="mb-4 text-xs text-muted-foreground line-clamp-2">
                  {product.description || "Tidak ada deskripsi."}
                </p>
                <div className="mt-auto flex items-end justify-between">
                  <p className="text-lg font-bold text-brand-primary">
                    {formatPrice(product.price)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-brand-primary-dark transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
