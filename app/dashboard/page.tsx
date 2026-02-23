import DashboardViews from "@/components/DashboardViews";
import { getAllShifts, getToday } from "@/app/lib";

type DashboardPageProps = {
  searchParams?: {
    access?: string;
  };
};

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const isJamieCalendar = searchParams?.access === "jamie";

  return (
    <DashboardViews
      shifts={isJamieCalendar ? getAllShifts() : []}
      today={getToday()}
      useCorePattern={isJamieCalendar}
      calendarName={isJamieCalendar ? "Jamie's 2026 Shifts" : "Your Shift Calendar"}
    />
  );
}
