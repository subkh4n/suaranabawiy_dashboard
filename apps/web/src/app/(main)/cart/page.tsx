"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

/** Format harga ke Rupiah */
const formatPrice = (price: number): string => {
  return `Rp ${price.toLocaleString("id-ID")}`;
};

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Keranjang Anda Kosong</h1>
        <p className="mb-8 text-muted-foreground max-w-sm">
          Sepertinya Anda belum menambahkan produk apapun ke dalam keranjang belanja.
        </p>
        <Link
          href="/shop"
          className="flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-brand-primary-dark transition-colors hover:bg-brand-primary/90"
        >
          Mulai Belanja <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Keranjang Belanja</h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Kolom Daftar Item */}
        <div className="flex-1 space-y-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="hidden grid-cols-12 gap-4 border-b border-border bg-secondary/50 p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
              <div className="col-span-6">Produk</div>
              <div className="col-span-3 text-center">Kuantitas</div>
              <div className="col-span-3 text-right">Total</div>
            </div>
            
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-12 sm:items-center">
                  
                  {/* Info Produk (Gambar + Nama) */}
                  <div className="col-span-1 flex items-center gap-4 sm:col-span-6">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/shop/${item.id}`} className="font-semibold line-clamp-2 hover:text-brand-primary hover:underline">
                        {item.name}
                      </Link>
                      <span className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)}</span>
                      {/* Tombol Hapus Mobile */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 flex w-fit items-center text-xs text-red-500 hover:text-red-600 sm:hidden"
                      >
                        <Trash2 className="mr-1 h-3 w-3" /> Hapus
                      </button>
                    </div>
                  </div>

                  {/* Kuantitas */}
                  <div className="col-span-1 sm:col-span-3 sm:flex sm:justify-center">
                    <div className="flex items-center w-fit rounded-lg border border-border bg-background p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total & Action */}
                  <div className="col-span-1 flex items-center justify-between sm:col-span-3 sm:justify-end">
                    <span className="font-bold sm:hidden">Total Produk:</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-brand-primary">{formatPrice(item.price * item.quantity)}</span>
                      {/* Tombol Hapus Desktop */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 sm:flex"
                        aria-label="Hapus dari keranjang"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
          
          <div className="flex">
            <Link href="/shop" className="text-sm font-medium text-brand-primary hover:underline">
              ← Lanjut Belanja
            </Link>
          </div>
        </div>

        {/* Kolom Ringkasan Belanja */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Ringkasan Belanja</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal Barang ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Biaya Pengiriman</span>
                <span className="text-xs italic">Dihitung di checkout</span>
              </div>
              
              <div className="my-4 border-t border-border"></div>
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Estimasi</span>
                <span className="text-2xl font-bold tracking-tight text-brand-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3.5 text-sm font-bold text-brand-primary-dark transition-all hover:bg-brand-primary/90 hover:shadow-lg hover:shadow-brand-primary/20"
            >
              Lanjut ke Checkout
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
