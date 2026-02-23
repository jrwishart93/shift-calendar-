import DayCard from "./DayCard";
import type { EnrichedShift } from "./types";

export default function MonthGrid({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <section className="glass-panel rounded-2xl p-4">
      <h2 className="mb-3 text-lg font-semibold text-slate-100">This Month</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {shifts.map((shift) => (
          <DayCard key={shift.date} shift={shift} compact />
        ))}
      </div>
    </section>
  );
}
