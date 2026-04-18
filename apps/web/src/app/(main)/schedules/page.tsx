import { Calendar, Radio } from "lucide-react";

/**
 * Halaman Jadwal Siaran — Jadwal harian & mingguan
 * Menampilkan jadwal siaran radio dan indikator LIVE
 */
export default function SchedulesPage() {
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
          <h2 className="mb-4 text-xl font-semibold">Hari Ini</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ScheduleCard
              time="05:00 — 06:30"
              title="Tafsir Al-Quran"
              speaker="Ust. Ahmad Zainuddin, Lc."
              description="Pembahasan tafsir surat Al-Baqarah ayat 1-5"
              isLive={false}
            />
            <ScheduleCard
              time="08:00 — 09:30"
              title="Fiqh Ibadah"
              speaker="Ust. Abdul Somad, Lc., MA."
              description="Bab Shalat — Tata Cara Sujud Sahwi"
              isLive
            />
            <ScheduleCard
              time="13:00 — 14:30"
              title="Hadits Arbain"
              speaker="Ust. Firanda Andirja, Lc."
              description="Hadits ke-5: Bid'ah dalam agama"
              isLive={false}
            />
            <ScheduleCard
              time="16:00 — 17:00"
              title="Sirah Nabawiyah"
              speaker="Ust. Khalid Basalamah"
              description="Hijrah ke Madinah — Pelajaran dan Hikmah"
              isLive={false}
            />
            <ScheduleCard
              time="19:30 — 21:00"
              title="Aqidah Ahlus Sunnah"
              speaker="Ust. Yazid bin Abdul Qadir Jawas"
              description="Pembahasan kitab Ushulus Sunnah"
              isLive={false}
            />
          </div>
        </section>

        {/* Info Jadwal Mingguan */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Jadwal Mingguan</h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Radio className="h-5 w-5" />
              <p className="text-sm">
                Jadwal mingguan akan tersedia setelah API dan database
                dikonfigurasi. Data akan otomatis sinkron dengan jadwal siaran.
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
