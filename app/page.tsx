import Header from "@/components/Header";
import ShareButton from "@/components/ShareButton";
import WeekView from "@/components/WeekView";
import { getAllShifts, getToday } from "./lib";

export default function HomePage() {
  const shifts = getAllShifts();
  const today = getToday();
  const startIdx = Math.max(0, shifts.findIndex((shift) => shift.date >= today));

  return (
    <main>
      <Header />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-300">Today</p>
          <p className="text-xl font-semibold">{today}</p>
        </div>
        <ShareButton />
        <WeekView shifts={shifts.slice(startIdx, startIdx + 7)} />
      </div>
    </main>
  );
}
