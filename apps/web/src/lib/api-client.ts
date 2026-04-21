/**
 * API Client — Typed wrapper for all Hono API calls.
 * The FE uses this instead of importing @suara-nabawiy/db directly.
 *
 * Uses an internal (server-side) URL when running on the server,
 * and the public URL on the client.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/v1";

/** Normalise the base so it always ends with /api/v1 */
function getBase(): string {
  let base = API_BASE;
  // Strip trailing slash
  if (base.endsWith("/")) base = base.slice(0, -1);
  // If the base doesn't contain /api/v1 yet, append it
  if (!base.includes("/api/v1")) base += "/api/v1";
  return base;
}

/** Generic fetch helper with error handling */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getBase()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    // Next.js 15+: opt out of caching for mutations
    cache: init?.method && init.method !== "GET" ? "no-store" : undefined,
  });

  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw new Error(json.error?.message || `API Error: ${res.status}`);
  }

  return json;
}

// ────────────────────────────────────────────
// Stats
// ────────────────────────────────────────────

export interface StatsData {
  products: number;
  audio: number;
  schedules: number;
  orders: number;
}

export async function getStats(): Promise<StatsData> {
  const json = await apiFetch<{ data: StatsData }>("/stats");
  return json.data;
}

// ────────────────────────────────────────────
// Products
// ────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  images: string[];
  slug: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getProducts(): Promise<Product[]> {
  const json = await apiFetch<{ data: Product[] }>("/products");
  return json.data;
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt" | "images"> & { images?: string[] }) {
  return apiFetch<{ data: Product }>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Omit<Product, "id" | "createdAt" | "updatedAt" | "images"> & { images?: string[] }) {
  return apiFetch<{ data: Product }>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number) {
  return apiFetch<{ data: { id: number } }>(`/products/${id}`, {
    method: "DELETE",
  });
}

// ────────────────────────────────────────────
// Audio Library
// ────────────────────────────────────────────

export interface AudioItem {
  id: number;
  title: string;
  category: string;
  speaker: string | null;
  description: string | null;
  fileUrl: string;
  duration: number;
  playsCount: number;
  createdAt: string;
}

export async function getAudioLibrary(): Promise<AudioItem[]> {
  const json = await apiFetch<{ data: AudioItem[] }>("/library?limit=999");
  return json.data;
}

export async function createAudio(data: {
  title: string;
  category: string;
  speaker?: string;
  description?: string;
  fileUrl: string;
  duration?: number;
}) {
  return apiFetch<{ data: AudioItem }>("/library", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAudio(id: number, data: {
  title: string;
  category: string;
  speaker?: string;
  description?: string;
  fileUrl: string;
  duration?: number;
}) {
  return apiFetch<{ data: AudioItem }>(`/library/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAudio(id: number) {
  return apiFetch<{ data: { id: number } }>(`/library/${id}`, {
    method: "DELETE",
  });
}

// ────────────────────────────────────────────
// Schedules
// ────────────────────────────────────────────

export interface Schedule {
  id: number;
  title: string;
  description: string | null;
  dayOfWeek: string | null;
  startTimeOnly: string | null;
  endTimeOnly: string | null;
  startTime: string | null;
  endTime: string | null;
  speakerName: string;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getSchedules(): Promise<Schedule[]> {
  const json = await apiFetch<{ data: Schedule[] }>("/schedules");
  return json.data;
}

export async function createSchedule(data: {
  title: string;
  description?: string;
  dayOfWeek?: string;
  startTimeOnly?: string;
  endTimeOnly?: string;
  speakerName: string;
  isLive?: boolean;
}) {
  return apiFetch<{ data: Schedule }>("/schedules", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSchedule(id: number, data: {
  title: string;
  description?: string;
  dayOfWeek?: string;
  startTimeOnly?: string;
  endTimeOnly?: string;
  speakerName: string;
  isLive?: boolean;
}) {
  return apiFetch<{ data: Schedule }>(`/schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSchedule(id: number) {
  return apiFetch<{ data: { id: number } }>(`/schedules/${id}`, {
    method: "DELETE",
  });
}

// ────────────────────────────────────────────
// Orders
// ────────────────────────────────────────────

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: string;
  paymentMethod: string | null;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getOrders(): Promise<Order[]> {
  const json = await apiFetch<{ data: Order[] }>("/orders");
  return json.data;
}

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status?: string;
  paymentMethod?: string;
  paymentId?: string;
  items: { productId: number; quantity: number; price: number }[];
}) {
  return apiFetch<{ data: Order }>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
