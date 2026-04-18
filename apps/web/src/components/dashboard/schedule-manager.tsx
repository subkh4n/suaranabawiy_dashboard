"use client";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Search,
  Clock,
  User,
  X,
  Save,
} from "lucide-react";
import { upsertSchedule, deleteSchedule } from "@/app/actions/dashboard";

interface Schedule {
  id: number;
  title: string;
  description: string;
  speakerName: string;
  startTimeOnly: string;
  endTimeOnly: string;
  isLive: boolean;
  dayOfWeek: string;
}

export function ScheduleManager({ initialSchedules }: { initialSchedules: Schedule[] }) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Schedule>>({});
  const [loading, setLoading] = useState(false);

  const filtered = initialSchedules.filter(
    (s) =>
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.speakerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      title: "",
      description: "",
      speakerName: "",
      startTimeOnly: "",
      endTimeOnly: "",
      isLive: false,
      dayOfWeek: "Senin",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setFormData({ ...schedule });
    setEditingId(schedule.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.speakerName) return;
    setLoading(true);
    try {
      await upsertSchedule({
        ...formData,
        id: editingId,
      });
      setShowForm(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save schedule:", error);
      alert("Gagal menyimpan jadwal.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus jadwal ini?")) return;
    setLoading(true);
    try {
      await deleteSchedule(id);
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      alert("Gagal menghapus jadwal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
            <Calendar className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Jadwal Siaran</h1>
            <p className="text-xs text-muted-foreground">
              Kelola jadwal siaran harian & mingguan
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90 disabled:opacity-50"
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          Tambah Jadwal
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari jadwal..."
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-brand-primary/20 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? "Edit Jadwal" : "Tambah Jadwal Baru"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Judul</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.title ?? ""} onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))} placeholder="Judul kajian" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Pembicara</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.speakerName ?? ""} onChange={(e) => setFormData((f) => ({ ...f, speakerName: e.target.value }))} placeholder="Nama ustadz" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Hari</label>
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.dayOfWeek ?? "Senin"} onChange={(e) => setFormData((f) => ({ ...f, dayOfWeek: e.target.value }))}>
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Mulai</label>
                <input type="time" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.startTimeOnly ?? ""} onChange={(e) => setFormData((f) => ({ ...f, startTimeOnly: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Selesai</label>
                <input type="time" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.endTimeOnly ?? ""} onChange={(e) => setFormData((f) => ({ ...f, endTimeOnly: e.target.value }))} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">Deskripsi</label>
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary" value={formData.description ?? ""} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} placeholder="Deskripsi singkat" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              type="button" 
              onClick={handleSave} 
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Judul</th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground sm:table-cell">Pembicara</th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground md:table-cell">Hari</th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Waktu</th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-right text-xs font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {filtered.map((schedule) => (
              <tr key={schedule.id} className="transition-colors hover:bg-card/60">
                <td className="p-4">
                  <p className="text-sm font-medium">{schedule.title}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{schedule.speakerName}</p>
                </td>
                <td className="hidden p-4 sm:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {schedule.speakerName}
                  </div>
                </td>
                <td className="hidden p-4 md:table-cell">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                    {schedule.dayOfWeek}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {schedule.startTimeOnly} — {schedule.endTimeOnly}
                  </div>
                </td>
                <td className="p-4">
                  {schedule.isLive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                      LIVE
                    </span>
                  ) : (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      Terjadwal
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => handleEdit(schedule)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete(schedule.id)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Tidak ada jadwal yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
