import { getAudioLibrary } from "@/lib/api-client";
import { LibraryManager } from "@/components/dashboard/library-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Library | Dashboard Admin",
};

export default async function LibraryDashboardPage() {
  let safeAudio: any[] = [];
  
  try {
    const allAudio = await getAudioLibrary();
    // API returns data with createdAt sorting typically, but we should ensure the format matches what LibraryManager expects.
    
    // Sort descending by id or createdAt (assuming API returns it as-is)
    const sortedAudio = [...allAudio].sort((a, b) => b.id - a.id);

    safeAudio = sortedAudio.map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      speaker: a.speaker ?? "—",
      description: a.description ?? "",
      duration: a.duration,
      playsCount: a.playsCount,
      fileUrl: a.fileUrl
    }));
  } catch (error) {
    console.error("Failed to fetch audio for dashboard", error);
  }

  return <LibraryManager initialItems={safeAudio} />;
}
