"use client";

import { useEffect, useState } from "react";
import { Calendar, Radio, Loader2 } from "lucide-react";

interface Schedule {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  speakerName: string;
  isLive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

function formatTimeRange(start: string, end: string) {
  const format = (iso: string) => {
    return new Date(iso)
      .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      .replace(".", ":");
  };
  return `${format(start)} — ${format(end)}`;
}

/**
 * Halaman Jadwal Siaran — Jadwal harian & mingguan
 * Menampilkan jadwal siaran radio dan indikator LIVE
 */
export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/schedules/today`);
        if (!res.ok) throw new Error("Gagal mengambil data jadwal");
        const json = await res.json();
        if (json.success) {
          // Urutkan berdasarkan waktu mulai tercepat
          const sortedData = json.data.sort(
            (a: Schedule, b: Schedule) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
          setSchedules(sortedData);
        } else {
          setError(json.error?.message || "Format error");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
            <Calendar className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Jadwal Siaran</h1>
            <p className="text-sm text-muted-foreground">
              Jadwal harian & mingguan siaran radio Suara Nabawiy
            </p>
          </div>
        </div>

        {/* Jadwal Hari Ini */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Tersedia Saat Ini</h2>
          
          {isLoading && (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-3">Memuat jadwal...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
              <p>Gagal memuat jadwal siang ini.</p>
              <p className="text-xs opacity-70 mt-1">({error})</p>
            </div>
          )}

          {!isLoading && !error && schedules.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              <p>Belum ada jadwal yang disiarkan hari ini.</p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {schedules.map((item) => (
              <ScheduleCard
                key={item.id}
                time={formatTimeRange(item.startTime, item.endTime)}
                title={item.title}
                speaker={item.speakerName}
                description={item.description || ""}
                isLive={item.isLive}
              />
            ))}
          </div>
        </section>

        {/* Info Jadwal Mingguan */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Jadwal Mingguan</h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Radio className="h-5 w-5" />
              <p className="text-sm">
                Jadwal di atas adalah jadwal siaran yang disinkronisasi langsung dari database. 
                Jadwal mingguan lengkap lainnya akan menyusul melalui dasbor API baru kami.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/** Card jadwal siaran */
function ScheduleCard({
  time,
  title,
  speaker,
  description,
  isLive,
}: {
  time: string;
  title: string;
  speaker: string;
  description: string;
  isLive: boolean;
}) {
  return (
    <div
      className={`hover-glow rounded-xl border p-5 transition-all ${
        isLive
          ? "border-brand-primary/30 bg-brand-surface/20 glow-brand"
          : "border-border bg-card"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {time}
        </span>
        {isLive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-live/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-live">
            <span className="pulse-live inline-block h-1.5 w-1.5 rounded-full bg-live" />
            LIVE
          </span>
        )}
      </div>
      <h3 className="mb-1 font-semibold text-card-foreground">{title}</h3>
      <p className="mb-2 text-xs text-brand-primary">{speaker}</p>
      <p className="text-xs text-muted-foreground/70">{description}</p>
    </div>
  );
}
