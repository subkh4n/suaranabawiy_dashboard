import { getSchedules } from "@/lib/api-client";
import { ScheduleManager } from "@/components/dashboard/schedule-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Jadwal | Dashboard Admin",
};

const DAYS_ORDER: Record<string, number> = {
  "Senin": 1, "Selasa": 2, "Rabu": 3, "Kamis": 4, "Jumat": 5, "Sabtu": 6, "Ahad": 7
};

export default async function SchedulesDashboardPage() {
  let safeSchedules: any[] = [];

  try {
    const allSchedules = await getSchedules();
    
    // Sort logic similar to to `orderBy(asc(schedules.dayOfWeek), asc(schedules.startTimeOnly))`
    const sortedSchedules = [...allSchedules].sort((a, b) => {
      const dayA = DAYS_ORDER[a.dayOfWeek || "Senin"] || 8;
      const dayB = DAYS_ORDER[b.dayOfWeek || "Senin"] || 8;
      if (dayA !== dayB) return dayA - dayB;
      
      const timeA = a.startTimeOnly || "00:00";
      const timeB = b.startTimeOnly || "00:00";
      return timeA.localeCompare(timeB);
    });

    safeSchedules = sortedSchedules.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description ?? "",
      speakerName: s.speakerName,
      startTimeOnly: s.startTimeOnly ?? "00:00",
      endTimeOnly: s.endTimeOnly ?? "00:00",
      isLive: s.isLive,
      dayOfWeek: s.dayOfWeek ?? "Senin"
    }));
  } catch (error) {
    console.error("Failed to fetch schedules for dashboard", error);
  }

  return <ScheduleManager initialSchedules={safeSchedules} />;
}
