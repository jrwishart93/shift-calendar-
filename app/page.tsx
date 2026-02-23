import Header from "@/components/Header";
import ShareButton from "@/components/ShareButton";
import ExportCalendarButton from "@/components/ExportCalendarButton";
import DashboardViews from "@/components/DashboardViews";
import { getAllShifts, getToday } from "./lib";

export default function HomePage() {
  const shifts = getAllShifts();
  const today = getToday();

  return (
    <main>
      <Header />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-300">Today</p>
          <p className="text-xl font-semibold">{today}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ShareButton />
          <ExportCalendarButton shifts={shifts} />
        </div>
        <DashboardViews shifts={shifts} today={today} />
      </div>
    </main>
  );
}
