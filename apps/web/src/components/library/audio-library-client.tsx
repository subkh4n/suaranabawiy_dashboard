"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Play,
  Pause,
  Clock,
  Headphones,
  TrendingUp,
  Filter,
} from "lucide-react";

/** Kategori audio */
const CATEGORIES = [
  { value: "", label: "Semua" },
  { value: "tafsir", label: "Tafsir" },
  { value: "fiqh", label: "Fiqh" },
  { value: "aqidah", label: "Aqidah" },
  { value: "hadits", label: "Hadits" },
  { value: "sirah", label: "Sirah" },
] as const;

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

/** Format durasi dalam detik ke MM:SS */
function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Format angka ke singkatan */
function formatCount(count: number): string {
  if (!count) return "0";
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

/** Warna badge kategori */
const CATEGORY_COLORS: Record<string, string> = {
  tafsir: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  fiqh: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  aqidah: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  hadits: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  sirah: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function AudioLibraryClient({ initialAudios }: { initialAudios: AudioItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);

  // Client-side filtering
  const filtered = initialAudios.filter(audio => {
    const matchesSearch = audio.title.toLowerCase().includes(search.toLowerCase()) || 
                          audio.speaker.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "" || audio.category === category;
    return matchesSearch && matchesCategory;
  });

  const handlePlay = useCallback((id: number) => {
    setPlayingId(prev => prev === id ? null : id);
  }, []);

  return (
    <>
      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul kajian, pembicara..."
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none rounded-lg border border-input bg-card py-2.5 pl-10 pr-8 text-sm text-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              category === c.value
                ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                : "border-border bg-card text-muted-foreground hover:border-brand-primary/30 hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="mb-4 text-xs text-muted-foreground">
        Menampilkan {filtered.length} dari {initialAudios.length} audio
      </p>

      {/* Audio List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Headphones className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Tidak ada audio yang cocok dengan pencarian Anda.
            </p>
          </div>
        ) : (
          filtered.map((audio) => (
            <div
              key={audio.id}
              className={`hover-glow group flex items-center gap-4 rounded-xl border p-4 transition-all ${
                playingId === audio.id
                  ? "border-brand-primary/30 bg-brand-surface/10 glow-brand"
                  : "border-border bg-card"
              }`}
            >
              {/* Play Button */}
              <button
                type="button"
                onClick={() => handlePlay(audio.id)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                  playingId === audio.id
                    ? "bg-brand-primary text-brand-primary-dark shadow-lg shadow-brand-primary/20"
                    : "bg-secondary text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                }`}
                aria-label={playingId === audio.id ? "Pause" : "Play"}
              >
                {playingId === audio.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </button>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-card-foreground">
                    {audio.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                      CATEGORY_COLORS[audio.category] ?? "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {audio.category}
                  </span>
                </div>
                <p className="truncate text-xs text-brand-primary">{audio.speaker}</p>
                <p className="mt-0.5 hidden truncate text-xs text-muted-foreground/60 sm:block">
                  {audio.description}
                </p>
              </div>

              {/* Meta */}
              <div className="hidden shrink-0 text-right sm:block">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(audio.duration)}</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground/60">
                  <TrendingUp className="h-3 w-3" />
                  <span>{formatCount(audio.playsCount)}x</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
