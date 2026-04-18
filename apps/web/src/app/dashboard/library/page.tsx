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

interface AudioItem {
  id: number;
  title: string;
  category: string;
  speaker: string;
  description: string;
  duration: number;
  playsCount: number;
  createdAt: string;
}

const INITIAL_AUDIO: AudioItem[] = [
  { id: 1, title: "Tafsir Surah Al-Fatihah", category: "tafsir", speaker: "Ust. Ahmad Zainuddin, Lc.", description: "Pembahasan lengkap tafsir surat Al-Fatihah", duration: 3420, playsCount: 1283, createdAt: "2026-03-10" },
  { id: 2, title: "Fiqh Shalat — Rukun & Syarat", category: "fiqh", speaker: "Ust. Abdul Somad, Lc., MA.", description: "Penjelasan detail rukun dan syarat sahnya shalat", duration: 4500, playsCount: 2541, createdAt: "2026-03-12" },
  { id: 3, title: "Aqidah Ahlus Sunnah — Iman kepada Allah", category: "aqidah", speaker: "Ust. Yazid bin Abdul Qadir Jawas", description: "Pembahasan tentang keimanan kepada Allah", duration: 5100, playsCount: 987, createdAt: "2026-03-15" },
  { id: 4, title: "Hadits Arbain #1 — Niat", category: "hadits", speaker: "Ust. Firanda Andirja, Lc.", description: "Innamal a'malu binniyat", duration: 2700, playsCount: 3102, createdAt: "2026-03-18" },
  { id: 5, title: "Sirah — Kelahiran Nabi ﷺ", category: "sirah", speaker: "Ust. Khalid Basalamah", description: "Kisah kelahiran dan tanda-tanda kenabian", duration: 3900, playsCount: 1756, createdAt: "2026-03-20" },
  { id: 6, title: "Fiqh Puasa Ramadhan", category: "fiqh", speaker: "Ust. Abdul Somad, Lc., MA.", description: "Hukum-hukum seputar puasa Ramadhan", duration: 5400, playsCount: 4210, createdAt: "2026-03-25" },
  { id: 7, title: "Hadits Arbain #2 — Islam, Iman, Ihsan", category: "hadits", speaker: "Ust. Firanda Andirja, Lc.", description: "Hadits Jibril tentang tiga tingkatan agama", duration: 3300, playsCount: 2890, createdAt: "2026-03-28" },
  { id: 8, title: "Aqidah — Nama & Sifat Allah", category: "aqidah", speaker: "Ust. Yazid bin Abdul Qadir Jawas", description: "Memahami Asma'ul Husna", duration: 4800, playsCount: 1120, createdAt: "2026-04-01" },
];

const CATEGORIES = ["tafsir", "fiqh", "aqidah", "hadits", "sirah"];

/** Format durasi */
function formatDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Dashboard — Halaman Kelola Audio Library
 */
export default function LibraryPage() {
  const [items, setItems] = useState<AudioItem[]>(INITIAL_AUDIO);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AudioItem>>({});

  const filtered = items.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.speaker.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || a.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalPlays = items.reduce((acc, a) => acc + a.playsCount, 0);

  const handleAdd = () => {
    setFormData({ title: "", category: "tafsir", speaker: "", description: "", duration: 0 });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item: AudioItem) => {
    setFormData({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.speaker) return;
    if (editingId) {
      setItems((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...formData } as AudioItem : a))
      );
    } else {
      const newId = Math.max(...items.map((a) => a.id), 0) + 1;
      setItems((prev) => [
        ...prev,
        { ...formData, id: newId, playsCount: 0, createdAt: new Date().toISOString().split("T")[0] } as AudioItem,
      ]);
    }
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
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
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90"
        >
          <Upload className="h-4 w-4" />
          Upload Audio
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Audio</p>
          <p className="mt-1 text-2xl font-bold">{items.length}</p>
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

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-brand-primary/20 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? "Edit Audio" : "Upload Audio Baru"}</h3>
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
              <label className="mb-1 block text-xs text-muted-foreground">Durasi (detik)</label>
              <input type="number" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.duration ?? 0} onChange={(e) => setFormData((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Deskripsi</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.description ?? ""} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} placeholder="Deskripsi singkat" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90">
              <Save className="h-4 w-4" />
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
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
          <tbody>
            {filtered.map((audio) => (
              <tr key={audio.id} className="border-b border-border transition-colors last:border-0 hover:bg-card/60">
                <td className="p-4">
                  <p className="text-sm font-medium">{audio.title}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{audio.speaker}</p>
                </td>
                <td className="hidden p-4 sm:table-cell">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {audio.speaker}
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
                    <button type="button" onClick={() => handleEdit(audio)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete(audio.id)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Hapus">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">Tidak ada audio yang ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
