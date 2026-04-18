import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — Suara Nabawiy",
    template: "%s | Dashboard Suara Nabawiy",
  },
  description: "Panel admin untuk mengelola Suara Nabawiy — jadwal, konten, dan order.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 shrink-0 border-b border-border flex items-center justify-end px-6 lg:px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
