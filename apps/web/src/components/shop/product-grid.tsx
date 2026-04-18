"use client";

import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart, CartItem } from "@/context/cart-context";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  slug: string;
  category: string;
  images: any; // Can be string[] or JSON string from DB
}

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    // Parse images if it's a string
    const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
    
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: Array.isArray(images) ? images[0] : undefined,
    };
    addToCart(item);
  };

  if (initialProducts.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p>Belum ada produk tersedia saat ini.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {initialProducts.map((product) => {
        const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
        const mainImage = Array.isArray(images) ? images[0] : null;

        return (
          <div
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-brand-primary/50 hover:shadow-lg hover:shadow-brand-primary/5"
          >
            {/* Product Image */}
            <div className="relative aspect-square w-full bg-secondary">
              {mainImage ? (
                <img
                  src={mainImage}
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
                  {formatPrice(Number(product.price))}
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
        );
      })}
    </div>
  );
}
