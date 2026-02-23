import DayCard from "./DayCard";
import type { EnrichedShift } from "./types";

export default function MonthGrid({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">This Month</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {shifts.map((shift) => (
          <DayCard key={shift.date} shift={shift} compact />
        ))}
      </div>
    </section>
  );
}
