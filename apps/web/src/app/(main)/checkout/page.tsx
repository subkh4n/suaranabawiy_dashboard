"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { ChevronRight, ShieldCheck, CreditCard, Banknote, QrCode, CheckCircle2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  
  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "qris">("qris");
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const subtotal = totalPrice;
  const shipping = 15000; // Flat rate dummy
  const finalTotal = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsProcessing(true);
    
    const customerName = `${firstName} ${lastName}`.trim();
    const customerAddress = `${address}, ${city}, ${province} ${postalCode}`;
    
    try {
      const payload = {
        customerName: customerName || email.split("@")[0],
        customerPhone: phone || "-",
        customerAddress: customerAddress || "-",
        totalAmount: finalTotal,
        paymentMethod: paymentMethod,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await fetch(`${API_URL}/api/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (json.success) {
        setOrderId(json.data.id);
        clearCart();
        setIsSuccess(true);
      } else {
        alert("Gagal memproses pesanan: " + json.error?.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsProcessing(false);
    }
  };

  /** Format harga ke Rupiah */
  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary/20">
          <CheckCircle2 className="h-12 w-12 text-brand-primary" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Pesanan Berhasil!</h1>
        <p className="mb-8 text-muted-foreground">Order ID: #{orderId}</p>
        
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          {paymentMethod === "qris" ? (
            <div>
              <h3 className="mb-4 font-semibold">Silakan Scan QRIS berikut:</h3>
              <div className="mx-auto mb-4 flex aspect-square w-48 items-center justify-center rounded-xl bg-white p-2">
                {/* Dummy QR */}
                <QrCode className="h-full w-full text-zinc-900" />
              </div>
              <p className="text-sm font-medium">Total: {formatPrice(finalTotal)}</p>
              <p className="mt-2 text-xs text-muted-foreground">Otomatis terkonfirmasi dalam 5 menit.</p>
            </div>
          ) : (
            <div>
              <h3 className="mb-4 font-semibold">Instruksi Transfer Bank</h3>
              <div className="mb-4 rounded-xl bg-secondary p-4 text-left">
                <p className="text-sm text-muted-foreground">Bank Syariah Indonesia (BSI)</p>
                <p className="text-xl font-mono font-bold tracking-widest text-brand-primary">712 345 6789</p>
                <p className="mt-1 text-sm">a.n. Suara Nabawiy Store</p>
              </div>
              <p className="text-sm font-medium">Total Transfer: {formatPrice(finalTotal)}</p>
              <p className="mt-2 text-xs text-muted-foreground">Mohon transfer tepat hingga 3 digit terakhir.</p>
            </div>
          )}
        </div>
        
        <div className="mt-10">
          <Link href="/shop" className="text-brand-primary hover:underline">
            ← Kembali ke Toko
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center text-muted-foreground">
        Keranjang belanja Anda masih kosong. 
        <Link href="/shop" className="ml-2 text-brand-primary hover:underline">Belanja sekarang.</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        
        {/* Left Column - Form */}
        <div className="flex-1 px-4 py-10 lg:px-12 lg:py-16">
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/cart" className="hover:text-foreground">Keranjang</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">Informasi & Pembayaran</span>
          </div>
          
          <form onSubmit={handleCheckout} className="space-y-10">
            {/* Kontak */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Informasi Kontak</h2>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </section>

            {/* Pengiriman */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Alamat Pengiriman</h2>
              <div className="grid gap-4">
                <div className="relative">
                  <select className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary">
                    <option>Indonesia</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nama depan" value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                  <input type="text" required placeholder="Nama belakang" value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>
                <input type="text" required placeholder="Alamat lengkap (Nama jalan, RT/RW)" value={address} onChange={e => setAddress(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" required placeholder="Kota" value={city} onChange={e => setCity(e.target.value)} className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                  <input type="text" required placeholder="Provinsi" value={province} onChange={e => setProvince(e.target.value)} className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                  <input type="text" required placeholder="Kode Pos" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                </div>
                <input type="tel" required placeholder="Nomor Telepon / WhatsApp" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" />
              </div>
            </section>

            {/* Metode Pembayaran */}
            <section>
              <h2 className="mb-2 text-lg font-semibold">Pembayaran</h2>
              <p className="mb-4 text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Semua transaksi aman dan dienkripsi.</p>
              
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <label className={`flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors ${paymentMethod === 'qris' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="qris" 
                    checked={paymentMethod === "qris"}
                    onChange={() => setPaymentMethod("qris")}
                    className="h-4 w-4 text-brand-primary accent-brand-primary"
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm font-medium">QRIS (OVO, Gopay, Dana, dll)</span>
                    <QrCode className="h-5 w-5 text-muted-foreground" />
                  </div>
                </label>
                
                <label className={`flex cursor-pointer items-center gap-3 p-4 transition-colors ${paymentMethod === 'bank_transfer' ? 'bg-secondary' : 'hover:bg-secondary/50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank_transfer" 
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="h-4 w-4 text-brand-primary accent-brand-primary"
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm font-medium">Transfer Bank (Manual)</span>
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                  </div>
                </label>
              </div>
              {paymentMethod === 'bank_transfer' && (
                <div className="mt-2 rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
                  Anda harus melakukan transfer secara manual ke rekening kami dan melakukan konfirmasi via WhatsApp.
                </div>
              )}
            </section>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center rounded-xl bg-brand-primary py-4 text-base font-bold text-brand-primary-dark transition-colors hover:bg-brand-primary/90 disabled:opacity-70"
            >
              {isProcessing ? "Memproses..." : "Bayar sekarang"}
            </button>
          </form>
        </div>

        {/* Right Column - Summary */}
        <div className="w-full border-t border-border bg-secondary lg:w-[450px] xl:w-[500px] lg:border-l lg:border-t-0 p-6 lg:p-10">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/80 text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                  <div className="h-6 w-6 opacity-20"><CreditCard /></div> {/* image placeholder */}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                </div>
                <div className="text-sm font-medium">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-border"></div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Pengiriman</span>
              <span className="font-medium text-foreground">{formatPrice(shipping)}</span>
            </div>
          </div>

          <div className="my-6 border-t border-border"></div>

          <div className="flex items-center justify-between">
            <span className="text-base font-medium">Total</span>
            <div className="flex items-end gap-2">
              <span className="text-xs text-muted-foreground mb-1">IDR</span>
              <span className="text-2xl font-bold tracking-tight">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
