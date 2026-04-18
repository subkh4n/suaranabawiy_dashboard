import { Radio, Users, Package, Headphones } from "lucide-react";

/**
 * Halaman utama Dashboard Admin
 * Menampilkan statistik overview: listener, order, konten
 */
export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Selamat datang di panel admin Suara Nabawiy.
      </p>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Radio className="h-5 w-5" />}
          title="Listener Aktif"
          value="—"
          subtitle="Real-time"
        />
        <StatCard
          icon={<Headphones className="h-5 w-5" />}
          title="Total Audio"
          value="—"
          subtitle="Di library"
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          title="Total Order"
          value="—"
          subtitle="Bulan ini"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          title="Pengunjung"
          value="—"
          subtitle="Hari ini"
        />
      </div>

      {/* Placeholder note */}
      <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Dashboard akan menampilkan data setelah API dan database dikonfigurasi.
        </p>
      </div>
    </div>
  );
}

/** Stat card component */
function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-muted-foreground/60">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
