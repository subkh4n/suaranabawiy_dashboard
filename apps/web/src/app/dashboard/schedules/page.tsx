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

/** Data mock jadwal */
interface Schedule {
  id: number;
  title: string;
  description: string;
  speakerName: string;
  startTime: string;
  endTime: string;
  isLive: boolean;
  day: string;
}

const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 1,
    title: "Tafsir Al-Quran",
    description: "Pembahasan tafsir juz 1",
    speakerName: "Ust. Ahmad Zainuddin",
    startTime: "05:00",
    endTime: "06:30",
    isLive: false,
    day: "Senin",
  },
  {
    id: 2,
    title: "Fiqh Ibadah",
    description: "Bab Shalat — Tata Cara Sujud Sahwi",
    speakerName: "Ust. Abdul Somad",
    startTime: "08:00",
    endTime: "09:30",
    isLive: true,
    day: "Senin",
  },
  {
    id: 3,
    title: "Hadits Arbain",
    description: "Hadits ke-5: Bid'ah dalam agama",
    speakerName: "Ust. Firanda Andirja",
    startTime: "13:00",
    endTime: "14:30",
    isLive: false,
    day: "Selasa",
  },
  {
    id: 4,
    title: "Sirah Nabawiyah",
    description: "Hijrah ke Madinah",
    speakerName: "Ust. Khalid Basalamah",
    startTime: "16:00",
    endTime: "17:00",
    isLive: false,
    day: "Rabu",
  },
  {
    id: 5,
    title: "Aqidah Ahlus Sunnah",
    description: "Pembahasan kitab Ushulus Sunnah",
    speakerName: "Ust. Yazid bin Abdul Qadir Jawas",
    startTime: "19:30",
    endTime: "21:00",
    isLive: false,
    day: "Kamis",
  },
];

/**
 * Dashboard — Halaman Kelola Jadwal Siaran
 * CRUD: Buat, Lihat, Edit, Hapus jadwal
 */
export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Schedule>>({});

  const filtered = schedules.filter(
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
      startTime: "",
      endTime: "",
      isLive: false,
      day: "Senin",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setFormData({ ...schedule });
    setEditingId(schedule.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.speakerName) return;

    if (editingId) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...formData } as Schedule : s))
      );
    } else {
      const newId = Math.max(...schedules.map((s) => s.id), 0) + 1;
      setSchedules((prev) => [
        ...prev,
        { ...formData, id: newId, isLive: false } as Schedule,
      ]);
    }
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
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
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90"
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

      {/* Form Modal */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-brand-primary/20 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">
              {editingId ? "Edit Jadwal" : "Tambah Jadwal Baru"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Judul
              </label>
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                value={formData.title ?? ""}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Judul kajian"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Pembicara
              </label>
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                value={formData.speakerName ?? ""}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, speakerName: e.target.value }))
                }
                placeholder="Nama ustadz"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Hari
              </label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                value={formData.day ?? "Senin"}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, day: e.target.value }))
                }
              >
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"].map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Mulai
                </label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  value={formData.startTime ?? ""}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, startTime: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Selesai
                </label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  value={formData.endTime ?? ""}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, endTime: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">
                Deskripsi
              </label>
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                value={formData.description ?? ""}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Deskripsi singkat"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-dark transition-colors hover:bg-brand-primary/90"
            >
              <Save className="h-4 w-4" />
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                Judul
              </th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground sm:table-cell">
                Pembicara
              </th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground md:table-cell">
                Hari
              </th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                Waktu
              </th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="p-4 text-right text-xs font-medium text-muted-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((schedule) => (
              <tr
                key={schedule.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-card/60"
              >
                <td className="p-4">
                  <p className="text-sm font-medium">{schedule.title}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {schedule.speakerName}
                  </p>
                </td>
                <td className="hidden p-4 sm:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {schedule.speakerName}
                  </div>
                </td>
                <td className="hidden p-4 md:table-cell">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                    {schedule.day}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {schedule.startTime} — {schedule.endTime}
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
                    <button
                      type="button"
                      onClick={() => handleEdit(schedule)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(schedule.id)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-muted-foreground"
                >
                  Tidak ada jadwal yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
