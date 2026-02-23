import Header from "@/components/Header";
import MonthGrid from "@/components/MonthGrid";
import { getAllShifts, getToday } from "../lib";

export default function MonthPage() {
  const today = getToday();
  const monthPrefix = today.slice(0, 7);
  const shifts = getAllShifts().filter((shift) => shift.date.startsWith(monthPrefix));

  return (
    <main className="px-safe pb-safe">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-4">
        <MonthGrid shifts={shifts} />
      </div>
    </main>
  );
}
