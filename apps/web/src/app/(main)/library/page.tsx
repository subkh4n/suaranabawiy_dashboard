import { Headphones, Clock, TrendingUp } from "lucide-react";
import { db, schema } from "@suara-nabawiy/db";
import { AudioLibraryClient } from "@/components/library/audio-library-client";

export const dynamic = "force-dynamic";

/** Format angka ke singkatan */
function formatCount(count: number): string {
  if (!count) return "0";
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

/**
 * Halaman Audio Library (Server Component)
 * Mengambil data langsung dari Neon Database melalui @suara-nabawiy/db
 */
export default async function LibraryPage() {
  let audioList: any[] = [];
  let error: string | null = null;

  try {
    // Fetch directly from Neon
    const rawData = await db.select().from(schema.audioLibrary);
    
    // Map snake_case to camelCase
    audioList = rawData.map((a: any) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      speaker: a.speaker,
      description: a.description,
      duration: a.duration,
      playsCount: a.plays_count,
      fileUrl: a.file_url,
      createdAt: a.created_at?.toISOString() || null,
    }));
  } catch (err: any) {
    console.error("Database Error:", err);
    error = err.message;
  }

  // Stats
  const totalAudio = audioList.length;
  const totalDuration = audioList.reduce((acc, a) => acc + (a.duration || 0), 0);
  const totalPlays = audioList.reduce((acc, a) => acc + (a.playsCount || 0), 0);

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

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
            <p>Gagal memuat data dari database.</p>
            <p className="text-xs opacity-70 mt-1">({error})</p>
          </div>
        ) : (
          <AudioLibraryClient initialAudios={audioList} />
        )}
      </div>
    </div>
  );
}
