"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Eye,
  Clock,
  Package,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  items: { name: string; qty: number; price: number }[];
  createdAt: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 1001,
    customerName: "Ahmad Fauzi",
    customerPhone: "0812-3456-7890",
    totalAmount: 235000,
    status: "completed",
    items: [
      { name: "Riyadhus Shalihin", qty: 1, price: 85000 },
      { name: "Madu Hutan Sumbawa 500ml", qty: 1, price: 150000 },
    ],
    createdAt: "2026-04-15",
  },
  {
    id: 1002,
    customerName: "Fatimah Azzahra",
    customerPhone: "0857-9876-5432",
    totalAmount: 70000,
    status: "shipped",
    items: [
      { name: "Parfum Al-Rehab — Dakar", qty: 1, price: 35000 },
      { name: "Parfum Al-Rehab — Soft", qty: 1, price: 35000 },
    ],
    createdAt: "2026-04-16",
  },
  {
    id: 1003,
    customerName: "Muhammad Ridwan",
    customerPhone: "0821-1234-5678",
    totalAmount: 450000,
    status: "paid",
    items: [{ name: "Tafsir Ibnu Katsir (4 Jilid)", qty: 1, price: 450000 }],
    createdAt: "2026-04-17",
  },
  {
    id: 1004,
    customerName: "Aisyah Nur",
    customerPhone: "0838-5678-9012",
    totalAmount: 195000,
    status: "pending",
    items: [
      { name: "Bulughul Maram", qty: 1, price: 75000 },
      { name: "Minyak Zaitun Extra Virgin 250ml", qty: 1, price: 120000 },
    ],
    createdAt: "2026-04-18",
  },
  {
    id: 1005,
    customerName: "Umar Hasan",
    customerPhone: "0878-2345-6789",
    totalAmount: 100000,
    status: "cancelled",
    items: [{ name: "Riyadhus Shalihin", qty: 1, price: 85000 }, { name: "Siwak Al-Falah", qty: 1, price: 15000 }],
    createdAt: "2026-04-14",
  },
];

/** Format harga ke Rupiah */
function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

/** Konfigurasi badge status */
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; className: string }
> = {
  pending: {
    label: "Menunggu",
    icon: <Clock className="h-3 w-3" />,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  paid: {
    label: "Dibayar",
    icon: <CheckCircle className="h-3 w-3" />,
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  shipped: {
    label: "Dikirim",
    icon: <Truck className="h-3 w-3" />,
    className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  completed: {
    label: "Selesai",
    icon: <CheckCircle className="h-3 w-3" />,
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  cancelled: {
    label: "Dibatalkan",
    icon: <XCircle className="h-3 w-3" />,
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

/**
 * Dashboard — Halaman Kelola Order
 * View orders, update status, lihat detail
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search);
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status === "completed" || o.status === "shipped" || o.status === "paid")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o
      )
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
          <ShoppingCart className="h-5 w-5 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Order</h1>
          <p className="text-xs text-muted-foreground">
            Kelola pesanan dan tracking pembayaran
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Order</p>
          <p className="mt-1 text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Menunggu Bayar</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="mt-1 text-xl font-bold text-brand-primary">{formatPrice(totalRevenue)}</p>
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
            placeholder="Cari order ID atau nama customer..."
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        >
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="paid">Dibayar</option>
          <option value="shipped">Dikirim</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Order ID</th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Customer</th>
              <th className="hidden p-4 text-left text-xs font-medium text-muted-foreground md:table-cell">Tanggal</th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Total</th>
              <th className="p-4 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-right text-xs font-medium text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const statusInfo = STATUS_CONFIG[order.status];
              return (
                <>
                  <tr
                    key={order.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-card/60"
                  >
                    <td className="p-4">
                      <p className="text-sm font-mono font-medium">#{order.id}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden p-4 md:table-cell">
                      <span className="text-sm text-muted-foreground">{order.createdAt}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium">{formatPrice(order.totalAmount)}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusInfo?.className}`}>
                        {statusInfo?.icon}
                        {statusInfo?.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Status Update Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="rounded-lg border border-input bg-card px-2 py-1 text-xs text-foreground focus:border-brand-primary focus:outline-none"
                        >
                          <option value="pending">Menunggu</option>
                          <option value="paid">Dibayar</option>
                          <option value="shipped">Dikirim</option>
                          <option value="completed">Selesai</option>
                          <option value="cancelled">Dibatalkan</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          aria-label="Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Detail */}
                  {expandedId === order.id && (
                    <tr key={`detail-${order.id}`} className="border-b border-border bg-card/30">
                      <td colSpan={6} className="p-4">
                        <div className="rounded-lg border border-border bg-card p-4">
                          <p className="mb-3 text-xs font-medium text-muted-foreground">Detail Item:</p>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{item.name}</span>
                                  <span className="text-muted-foreground">x{item.qty}</span>
                                </div>
                                <span className="text-muted-foreground">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 border-t border-border pt-3 text-right text-sm font-semibold">
                            Total: {formatPrice(order.totalAmount)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                  Tidak ada order yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
