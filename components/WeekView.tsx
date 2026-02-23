import DayCard from "./DayCard";
import type { EnrichedShift } from "./types";

export default function WeekView({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Next 7 Days</h2>
      <div className="space-y-2">
        {shifts.map((shift) => (
          <DayCard key={shift.date} shift={shift} />
        ))}
      </div>
    </section>
  );
}
