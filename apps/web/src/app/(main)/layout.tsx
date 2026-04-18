import { RadioPlayer } from "@/components/radio-player";
import { Navbar } from "@/components/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-24">{children}</main>
      {/* Persistent Radio Player — tidak re-mount saat navigasi dalam area web utama */}
      <RadioPlayer />
    </div>
  );
}
