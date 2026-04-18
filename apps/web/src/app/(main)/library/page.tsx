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

/** Data mock audio */
const AUDIO_DATA: AudioItem[] = [
  {
    id: 1,
    title: "Tafsir Surah Al-Fatihah",
    category: "tafsir",
    speaker: "Ust. Ahmad Zainuddin, Lc.",
    description:
      "Pembahasan lengkap tafsir surat Al-Fatihah, makna dan hikmahnya",
    duration: 3420,
    playsCount: 1283,
    createdAt: "2026-03-10",
  },
  {
    id: 2,
    title: "Fiqh Shalat — Rukun & Syarat",
    category: "fiqh",
    speaker: "Ust. Abdul Somad, Lc., MA.",
    description: "Penjelasan detail rukun dan syarat sahnya shalat",
    duration: 4500,
    playsCount: 2541,
    createdAt: "2026-03-12",
  },
  {
    id: 3,
    title: "Aqidah Ahlus Sunnah — Iman kepada Allah",
    category: "aqidah",
    speaker: "Ust. Yazid bin Abdul Qadir Jawas",
    description:
      "Kitab Ushulus Sunnah — Pembahasan tentang keimanan kepada Allah",
    duration: 5100,
    playsCount: 987,
    createdAt: "2026-03-15",
  },
  {
    id: 4,
    title: "Hadits Arbain #1 — Niat",
    category: "hadits",
    speaker: "Ust. Firanda Andirja, Lc.",
    description: "Pembahasan hadits pertama: Innamal a'malu binniyat",
    duration: 2700,
    playsCount: 3102,
    createdAt: "2026-03-18",
  },
  {
    id: 5,
    title: "Sirah Nabawiyah — Kelahiran Nabi ﷺ",
    category: "sirah",
    speaker: "Ust. Khalid Basalamah",
    description:
      "Kisah kelahiran Nabi Muhammad ﷺ dan tanda-tanda kenabian",
    duration: 3900,
    playsCount: 1756,
    createdAt: "2026-03-20",
  },
  {
    id: 6,
    title: "Tafsir Surah Al-Baqarah Ayat 1-5",
    category: "tafsir",
    speaker: "Ust. Ahmad Zainuddin, Lc.",
    description:
      "Sifat-sifat orang beriman dalam pembukaan surat Al-Baqarah",
    duration: 4200,
    playsCount: 892,
    createdAt: "2026-03-22",
  },
  {
    id: 7,
    title: "Fiqh Puasa Ramadhan",
    category: "fiqh",
    speaker: "Ust. Abdul Somad, Lc., MA.",
    description:
      "Hukum-hukum seputar puasa Ramadhan dan hal-hal yang membatalkannya",
    duration: 5400,
    playsCount: 4210,
    createdAt: "2026-03-25",
  },
  {
    id: 8,
    title: "Hadits Arbain #2 — Islam, Iman, Ihsan",
    category: "hadits",
    speaker: "Ust. Firanda Andirja, Lc.",
    description: "Hadits Jibril tentang tiga tingkatan agama",
    duration: 3300,
    playsCount: 2890,
    createdAt: "2026-03-28",
  },
  {
    id: 9,
    title: "Aqidah — Nama & Sifat Allah",
    category: "aqidah",
    speaker: "Ust. Yazid bin Abdul Qadir Jawas",
    description:
      "Memahami Asma'ul Husna dan sifat-sifat kesempurnaan Allah",
    duration: 4800,
    playsCount: 1120,
    createdAt: "2026-04-01",
  },
  {
    id: 10,
    title: "Sirah — Hijrah ke Madinah",
    category: "sirah",
    speaker: "Ust. Khalid Basalamah",
    description:
      "Perjalanan hijrah Nabi ﷺ dari Makkah ke Madinah",
    duration: 4100,
    playsCount: 1543,
    createdAt: "2026-04-05",
  },
  {
    id: 11,
    title: "Fiqh Zakat — Harta yang Wajib Dizakati",
    category: "fiqh",
    speaker: "Ust. Abdul Somad, Lc., MA.",
    description:
      "Pembahasan lengkap harta yang wajib dizakati dan nishabnya",
    duration: 3600,
    playsCount: 1678,
    createdAt: "2026-04-08",
  },
  {
    id: 12,
    title: "Hadits Arbain #3 — Rukun Islam",
    category: "hadits",
    speaker: "Ust. Firanda Andirja, Lc.",
    description: "Hadits tentang lima rukun Islam",
    duration: 2850,
    playsCount: 2456,
    createdAt: "2026-04-10",
  },
];

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
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Format angka ke singkatan */
function formatCount(count: number): string {
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

  // Filter data berdasarkan search & kategori
  const filtered = AUDIO_DATA.filter((item) => {
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.speaker.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || item.category === category;
    return matchSearch && matchCategory;
  });

  // Stats
  const totalAudio = AUDIO_DATA.length;
  const totalDuration = AUDIO_DATA.reduce((acc, a) => acc + a.duration, 0);
  const totalPlays = AUDIO_DATA.reduce((acc, a) => acc + a.playsCount, 0);

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
          {filtered.length === 0 ? (
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
