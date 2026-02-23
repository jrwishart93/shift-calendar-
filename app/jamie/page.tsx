import DayCard from "@/components/DayCard";
import Header from "@/components/Header";
import MonthGrid from "@/components/MonthGrid";
import { getAllShifts, getToday } from "../lib";

export default function JamiePublicPage() {
  const today = getToday();
  const shifts = getAllShifts();
  const startIdx = Math.max(0, shifts.findIndex((shift) => shift.date >= today));
  const upcoming = shifts.slice(startIdx, startIdx + 14);
  const monthPrefix = today.slice(0, 7);

  return (
    <main>
      <Header />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Upcoming 14 Days</h2>
          <div className="space-y-2">
            {upcoming.map((shift) => (
              <DayCard key={shift.date} shift={shift} />
            ))}
          </div>
        </section>
        <MonthGrid shifts={shifts.filter((shift) => shift.date.startsWith(monthPrefix))} />
      </div>
    </main>
  );
}
