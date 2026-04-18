"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { upsertProduct, deleteProduct } from "@/app/actions/dashboard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  slug: string;
}

const PRODUCT_CATEGORIES = ["Buku", "Parfum", "Herbal", "Perlengkapan"];

/** Format harga ke Rupiah */
function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);

  const filtered = initialProducts.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalStock = initialProducts.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = initialProducts.reduce((acc, p) => acc + p.price * p.stock, 0);

  const handleAdd = () => {
    setFormData({ name: "", description: "", price: 0, stock: 0, category: "Buku", slug: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setFormData({ ...product });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) return;
    setLoading(true);
    try {
      const slug = formData.slug || formData.name?.toLowerCase().replace(/\s+/g, "-") || "";
      await upsertProduct({
        ...formData,
        id: editingId,
        slug,
      });
      setShowForm(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    setLoading(true);
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Gagal menghapus produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
            <Package className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Produk</h1>
            <p className="text-xs text-muted-foreground">
              Kelola produk toko islami
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90 disabled:opacity-50"
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Produk</p>
          <p className="mt-1 text-2xl font-bold">{initialProducts.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Stok</p>
          <p className="mt-1 text-2xl font-bold">{totalStock}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Nilai Inventaris</p>
          <p className="mt-1 text-xl font-bold">{formatPrice(totalValue)}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        >
          <option value="">Semua Kategori</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Form Overlay/Section */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-brand-primary/20 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? "Edit Produk" : "Tambah Produk Baru"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Nama Produk</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.name ?? ""} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} placeholder="Nama produk" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Kategori</label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.category ?? "Buku"} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Harga (Rp)</label>
              <input type="number" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.price ?? 0} onChange={(e) => setFormData((f) => ({ ...f, price: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Stok</label>
              <input type="number" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.stock ?? 0} onChange={(e) => setFormData((f) => ({ ...f, stock: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Deskripsi</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.description ?? ""} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} placeholder="Deskripsi produk" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              type="button" 
              onClick={handleSave} 
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Produk</th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground md:table-cell">Kategori</th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Harga</th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Stok</th>
              <th className="p-4 text-right text-xs font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {filtered.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-card/60">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden p-4 md:table-cell">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{product.category}</span>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-brand-primary">{formatPrice(product.price)}</p>
                </td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.stock <= 10 ? "bg-red-500/10 text-red-400" : product.stock <= 20 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => handleEdit(product)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete(product.id)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Tidak ada produk yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
