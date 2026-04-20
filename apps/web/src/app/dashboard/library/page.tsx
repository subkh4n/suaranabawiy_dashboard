import { db } from "@suara-nabawiy/db";
import { audioLibrary } from "@suara-nabawiy/db/schema";
import { desc } from "drizzle-orm";
import { LibraryManager } from "@/components/dashboard/library-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Library | Dashboard Admin",
};

export default async function LibraryDashboardPage() {
  const allAudio = await db.select().from(audioLibrary).orderBy(desc(audioLibrary.createdAt));

  // Map to the interface expected by the client component
  const safeAudio = allAudio.map(a => ({
    id: a.id,
    title: a.title,
    category: a.category,
    speaker: a.speaker ?? "—",
    description: a.description ?? "",
    duration: a.duration,
    playsCount: a.playsCount,
    fileUrl: a.fileUrl
  }));

  return <LibraryManager initialItems={safeAudio} />;
}
