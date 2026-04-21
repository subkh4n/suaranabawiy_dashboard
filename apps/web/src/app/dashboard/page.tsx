import { Radio, Package, Headphones } from "lucide-react";
import { getStats } from "@/lib/api-client";

export const dynamic = "force-dynamic";

/**
 * Halaman utama Dashboard Admin
 * Menampilkan statistik overview dari API
 */
export default async function DashboardPage() {
  let stats = { products: 0, audio: 0, schedules: 0, orders: 0 };
  let error = null;

  try {
    stats = await getStats();
  } catch (err: any) {
    console.error("API Error (Stats):", err);
    error = err.message;
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Selamat datang di panel admin Suara Nabawiy.
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          <p className="text-sm font-medium">Gagal memuat statistik ({error})</p>
        </div>
      )}

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
          value={stats.audio.toString()}
          subtitle="Di library"
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          title="Total Produk"
          value={stats.products.toString()}
          subtitle="Di katalog"
        />
        <StatCard
          icon={<Radio className="h-5 w-5" />}
          title="Total Jadwal"
          value={stats.schedules.toString()}
          subtitle="Siaran terjadwal"
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          title="Total Order"
          value={stats.orders.toString()}
          subtitle="Total masuk"
        />
      </div>

      {/* Quick Action Note */}
      <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Dashboard terhubung ke API backend Suara Nabawiy. Data diperbarui secara berkala.
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
