"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Search,
  Play,
  Pause,
  Clock,
  Headphones,
  TrendingUp,
  Filter,
  Loader2,
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

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

/**
 * Halaman Audio Library — Koleksi rekaman kajian
 * Fitur: pencarian, filter kategori, dan player inline
 */
export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);
  
  const [audioList, setAudioList] = useState<AudioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        setIsLoading(true);
        const urlArgs = new URLSearchParams();
        urlArgs.append("limit", "50");
        if (category) urlArgs.append("category", `eq.${category}`);
        if (search) urlArgs.append("title", `ilike.*${search}*`);

        const res = await fetch(`${API_URL}/audio_library?${urlArgs.toString()}`);
        if (!res.ok) throw new Error("Gagal mengambil data audio dari Neon DB");
        const data = await res.json();
        
        // Map snake_case to camelCase
        const mappedData = data.map((a: any) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          speaker: a.speaker,
          description: a.description,
          duration: a.duration,
          playsCount: a.plays_count,
          fileUrl: a.file_url,
          createdAt: a.created_at,
        }));
        setAudioList(mappedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAudios();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  // Karena backend sudah me-filter via /api/v1/library?q=&category=, 
  // filtered data adalah audioList.
  const filtered = audioList;

  // Stats
  const totalAudio = audioList.length;
  // Fallback to 0 if duration/playsCount is missing, which schema defaults to 0 anyway
  const totalDuration = audioList.reduce((acc, a) => acc + (a.duration || 0), 0);
  const totalPlays = audioList.reduce((acc, a) => acc + (a.playsCount || 0), 0);

  const handlePlay = useCallback(
    (id: number) => {
      if (playingId === id) {
        setPlayingId(null);
      } else {
        setPlayingId(id);
      }
    },
    [playingId]
  );

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
            <Headphones className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Audio Library</h1>
            <p className="text-sm text-muted-foreground">
              Koleksi rekaman kajian sunnah. Cari dan dengarkan kapan saja.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Headphones className="h-4 w-4" />
              <span className="text-xs">Total Audio</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalAudio}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Total Durasi</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {Math.floor(totalDuration / 3600)}h
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Total Plays</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {formatCount(totalPlays)}
            </p>
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
          Menampilkan {filtered.length} dari {totalAudio} audio
        </p>

        {/* Audio List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mb-4 h-8 w-8 animate-spin" />
              <p>Memuat koleksi audio...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
              <p>Gagal memuat data dari database.</p>
              <p className="text-xs opacity-70 mt-1">({error})</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Headphones className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Tidak ada audio yang cocok dengan pencarian Anda.
              </p>
            </div>
          ) : (
            filtered.map((audio) => (
              <AudioCard
                key={audio.id}
                audio={audio}
                isPlaying={playingId === audio.id}
                onTogglePlay={() => handlePlay(audio.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/** Komponen card audio individual */
function AudioCard({
  audio,
  isPlaying,
  onTogglePlay,
}: {
  audio: AudioItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
}) {
  return (
    <div
      className={`hover-glow group flex items-center gap-4 rounded-xl border p-4 transition-all ${
        isPlaying
          ? "border-brand-primary/30 bg-brand-surface/10 glow-brand"
          : "border-border bg-card"
      }`}
    >
      {/* Play Button */}
      <button
        type="button"
        onClick={onTogglePlay}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
          isPlaying
            ? "bg-brand-primary text-brand-primary-dark shadow-lg shadow-brand-primary/20"
            : "bg-secondary text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
        }`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
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
  );
}
