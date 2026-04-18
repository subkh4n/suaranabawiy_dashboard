import { Radio, Headphones, BookOpen, Calendar } from "lucide-react";

/**
 * Halaman utama Suara Nabawiy
 * Menampilkan hero section, info streaming, dan navigasi fitur utama
 */
export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-brand-primary/5 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-brand-glow/3 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          {/* Live Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-live/30 bg-live/10 px-4 py-1.5">
            <span className="pulse-live inline-block h-2 w-2 rounded-full bg-live" />
            <span className="text-sm font-medium text-live-glow">
              Sedang Siaran Langsung
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient-brand">Suara Nabawiy</span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Radio Streaming Islami — Kajian Sunnah 24 Jam
          </p>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground/70">
            Dengarkan kajian para ulama ahli sunnah kapan saja, di mana saja.
            Koleksi rekaman, jadwal siaran, dan toko produk islami dalam satu
            platform.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Radio className="h-6 w-6" />}
            title="Radio Live"
            description="Siaran langsung kajian sunnah 24 jam non-stop"
            href="/"
          />
          <FeatureCard
            icon={<Headphones className="h-6 w-6" />}
            title="Audio Library"
            description="Koleksi rekaman kajian dengan pencarian & filter"
            href="/library"
          />
          <FeatureCard
            icon={<Calendar className="h-6 w-6" />}
            title="Jadwal Siaran"
            description="Jadwal harian & mingguan siaran radio"
            href="/schedules"
          />
          <FeatureCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Toko Islami"
            description="Buku, parfum, dan produk islami pilihan"
            href="/shop"
          />
        </div>
      </section>

      {/* Jadwal Hari Ini — Placeholder */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-semibold">Jadwal Hari Ini</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ScheduleItem
              time="05:00 — 06:30"
              title="Tafsir Al-Quran"
              speaker="Ust. Ahmad Zainuddin"
              isLive={false}
            />
            <ScheduleItem
              time="08:00 — 09:30"
              title="Fiqh Ibadah"
              speaker="Ust. Abdul Somad"
              isLive
            />
            <ScheduleItem
              time="13:00 — 14:30"
              title="Hadits Arbain"
              speaker="Ust. Firanda Andirja"
              isLive={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/** Card fitur utama */
function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="hover-glow group rounded-xl border border-border bg-card p-6 transition-colors hover:bg-card/80"
    >
      <div className="mb-3 inline-flex rounded-lg bg-brand-primary/10 p-2.5 text-brand-primary transition-colors group-hover:bg-brand-primary/20">
        {icon}
      </div>
      <h3 className="mb-1 font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </a>
  );
}

/** Item jadwal siaran */
function ScheduleItem({
  time,
  title,
  speaker,
  isLive,
}: {
  time: string;
  title: string;
  speaker: string;
  isLive: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isLive
          ? "border-brand-primary/30 bg-brand-surface/20 glow-brand"
          : "border-border bg-card hover:bg-card/80"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{time}</span>
        {isLive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-live/10 px-2 py-0.5 text-xs font-medium text-live">
            <span className="pulse-live inline-block h-1.5 w-1.5 rounded-full bg-live" />
            LIVE
          </span>
        )}
      </div>
      <h4 className="font-medium text-card-foreground">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{speaker}</p>
    </div>
  );
}
