import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility untuk menggabungkan class names dengan Tailwind Merge.
 * Shared di semua apps dan packages.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
