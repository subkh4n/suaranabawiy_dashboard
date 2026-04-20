import { db, schedules } from "@suara-nabawiy/db";
import { asc } from "drizzle-orm";
import { ScheduleManager } from "@/components/dashboard/schedule-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Jadwal | Dashboard Admin",
};

export default async function SchedulesDashboardPage() {
  const allSchedules = await db
    .select()
    .from(schedules)
    .orderBy(asc(schedules.dayOfWeek), asc(schedules.startTimeOnly));

  // Map to the interface expected by the client component
  const safeSchedules = allSchedules.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description ?? "",
    speakerName: s.speakerName,
    startTimeOnly: s.startTimeOnly ?? "00:00",
    endTimeOnly: s.endTimeOnly ?? "00:00",
    isLive: s.isLive,
    dayOfWeek: s.dayOfWeek ?? "Senin"
  }));

  return <ScheduleManager initialSchedules={safeSchedules} />;
}
