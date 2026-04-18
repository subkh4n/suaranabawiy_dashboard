"use client";

import { useState } from "react";
import {
  Headphones,
  Pencil,
  Trash2,
  Search,
  Clock,
  User,
  TrendingUp,
  X,
  Save,
  Upload,
} from "lucide-react";
import { upsertAudio, deleteAudio } from "@/app/actions/dashboard";

interface AudioItem {
  id: number;
  title: string;
  category: string;
  speaker: string;
  description: string;
  duration: number;
  playsCount: number;
  fileUrl: string;
}

const CATEGORIES = ["tafsir", "fiqh", "aqidah", "hadits", "sirah"];

/** Format durasi */
function formatDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function LibraryManager({ initialItems }: { initialItems: AudioItem[] }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AudioItem>>({});
  const [loading, setLoading] = useState(false);

  const filtered = initialItems.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.speaker.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || a.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalPlays = initialItems.reduce((acc, a) => acc + a.playsCount, 0);

  const handleAdd = () => {
    setFormData({ title: "", category: "tafsir", speaker: "", description: "", duration: 0, fileUrl: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: AudioItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.fileUrl) return;
    setLoading(true);
    try {
      await upsertAudio({
        ...formData,
        id: editingId,
      });
      setShowForm(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save audio:", error);
      alert("Gagal menyimpan audio.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus audio ini?")) return;
    setLoading(true);
    try {
      await deleteAudio(id);
    } catch (error) {
      console.error("Failed to delete audio:", error);
      alert("Gagal menghapus audio.");
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
            <Headphones className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Audio Library</h1>
            <p className="text-xs text-muted-foreground">
              Kelola koleksi rekaman kajian
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90 disabled:opacity-50"
          disabled={loading}
        >
          <Upload className="h-4 w-4" />
          Tambah Audio
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Audio</p>
          <p className="mt-1 text-2xl font-bold">{initialItems.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Kategori</p>
          <p className="mt-1 text-2xl font-bold">{CATEGORIES.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Plays</p>
          <p className="mt-1 text-2xl font-bold">{(totalPlays / 1000).toFixed(1)}k</p>
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
            placeholder="Cari audio..."
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-brand-primary/20 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? "Edit Audio" : "Tambah Audio Baru"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Judul</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.title ?? ""} onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))} placeholder="Judul audio" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Pembicara</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.speaker ?? ""} onChange={(e) => setFormData((f) => ({ ...f, speaker: e.target.value }))} placeholder="Nama ustadz" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Kategori</label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.category ?? "tafsir"} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">URL File Audio</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.fileUrl ?? ""} onChange={(e) => setFormData((f) => ({ ...f, fileUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Durasi (detik)</label>
              <input type="number" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.duration ?? 0} onChange={(e) => setFormData((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Deskripsi</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.description ?? ""} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} placeholder="Deskripsi singkat" />
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
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Judul</th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground sm:table-cell">Pembicara</th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground md:table-cell">Kategori</th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Durasi</th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground lg:table-cell">Plays</th>
              <th className="p-4 text-right text-xs font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {filtered.map((audio) => (
              <tr key={audio.id} className="transition-colors hover:bg-card/60">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Headphones className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{audio.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground sm:hidden">{audio.speaker}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden p-4 sm:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {audio.speaker || "—"}
                  </div>
                </td>
                <td className="hidden p-4 md:table-cell">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs capitalize text-muted-foreground">
                    {audio.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDuration(audio.duration)}
                  </div>
                </td>
                <td className="hidden p-4 lg:table-cell">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {audio.playsCount.toLocaleString()}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => handleEdit(audio)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete(audio.id)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
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
            Tidak ada audio yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
