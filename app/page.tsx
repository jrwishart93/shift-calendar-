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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Shift calendar</p>
          <p className="mt-1 text-sm text-slate-300">Monthly shifts at a glance. Today: <span className="font-medium text-slate-100">{today}</span></p>
        </div>
        <DashboardViews shifts={shifts} today={today} />
        <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-2">
          <ShareButton />
          <ExportCalendarButton shifts={shifts} />
        </div>
      </div>
    </main>
  );
}
