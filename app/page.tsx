import Header from "@/components/Header";
import ShareButton from "@/components/ShareButton";
import ExportCalendarButton from "@/components/ExportCalendarButton";
import DashboardViews from "@/components/DashboardViews";
import { getAllShifts, getToday } from "./lib";

export default function HomePage() {
  const shifts = getAllShifts();
  const today = getToday();

  return (
    <main className="px-safe pb-safe">
      <Header />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-4">
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-slate-900 to-slate-900/70 p-4 shadow-xl shadow-cyan-950/20">
          <p className="text-sm text-cyan-200/80">Today</p>
          <p className="text-xl font-semibold tracking-tight">{today}</p>
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
