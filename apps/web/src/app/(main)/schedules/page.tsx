import { Calendar, Radio, Clock } from "lucide-react";
import { db } from "@suara-nabawiy/db";
import { schedules } from "@suara-nabawiy/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const DAYS_OF_WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];

/**
 * Halaman Jadwal Siaran (Server Component)
 * Menampilkan jadwal mingguan yang dikelola via Dashboard.
 */
export default async function SchedulesPage() {
  let allSchedules: any[] = [];
  let error: string | null = null;

  try {
    allSchedules = await db.query.schedules.findMany({
      orderBy: [asc(schedules.startTimeOnly)],
    });
  } catch (err: any) {
    console.error("Database Error:", err);
    error = err.message;
  }

  // Helper to group by day
  const groupedSchedules = DAYS_OF_WEEK.map(day => ({
    day,
    items: allSchedules.filter(s => s.dayOfWeek === day)
  })).filter(group => group.items.length > 0);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10">
              <Calendar className="h-6 w-6 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Jadwal Siaran</h1>
              <p className="text-muted-foreground">
                Jadwal harian & mingguan siaran rutin Suara Nabawiy
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
            <p className="font-medium">Gagal memuat jadwal.</p>
            <p className="mt-1 text-sm opacity-70">({error})</p>
          </div>
        ) : groupedSchedules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-20" />
            <p>Belum ada jadwal siaran yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedSchedules.map((group) => (
              <section key={group.day}>
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="text-xl font-bold text-foreground">{group.day}</h2>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <ScheduleCard
                      key={item.id}
                      time={`${item.startTimeOnly} — ${item.endTimeOnly}`}
                      title={item.title}
                      speaker={item.speakerName}
                      description={item.description || ""}
                      isLive={item.isLive}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <section className="mt-16 rounded-2xl border border-border bg-card/30 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Siaran Non-Stop 24 Jam</h3>
              <p className="text-sm text-muted-foreground">
                Selain jadwal kajian rutin di atas, Suara Nabawiy menyiarkan tilawah Al-Quran, 
                dzikir pagi petang, dan nasihat-nasihat singkat di sela-sela waktu siaran.
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
      className={`group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
        isLive
          ? "border-brand-primary/40 bg-brand-primary/[0.03] shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.1)]"
          : "border-border bg-card hover:border-brand-primary/30 hover:shadow-lg"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary">
          <Clock className="h-3.5 w-3.5" />
          {time}
        </div>
        {isLive && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            LIVE
          </span>
        )}
      </div>
      
      <h3 className="mb-1 text-lg font-bold text-foreground group-hover:text-brand-primary transition-colors">
        {title}
      </h3>
      <p className="mb-3 text-sm font-medium text-brand-primary/80">{speaker}</p>
      
      {description && (
        <p className="line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed">
          {description}
        </p>
      )}

      {isLive && (
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-primary/5 to-transparent" />
      )}
    </div>
  );
}
