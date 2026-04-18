"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Headphones,
  Package,
  ShoppingCart,
  Radio,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

/** Menu items sidebar */
const MENU_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedules", label: "Jadwal Siaran", icon: Calendar },
  { href: "/library", label: "Audio Library", icon: Headphones },
  { href: "/products", label: "Produk", icon: Package },
  { href: "/orders", label: "Order", icon: ShoppingCart },
] as const;

/**
 * Sidebar — Navigasi admin dashboard
 * Fixed di sisi kiri, collapsible di mobile
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/10">
            <Radio className="h-4 w-4 text-brand-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Suara Nabawiy</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-sidebar-active-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-active/50 hover:text-sidebar-active-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 flex flex-col gap-4">
          <ThemeToggle />
          <p className="text-xs text-muted-foreground/50">v0.1.0</p>
        </div>
      </div>
    </aside>
  );
}
