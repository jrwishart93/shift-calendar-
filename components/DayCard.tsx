import { typeColours } from "./shift-utils";
import type { EnrichedShift } from "./types";

export default function DayCard({ shift, compact = false }: { shift: EnrichedShift; compact?: boolean }) {
  return (
    <article
      className={`glass-panel rounded-xl border p-3 ${typeColours[shift.type] ?? typeColours.unknown} ${compact ? "min-h-20" : ""}`}
    >
      <p className="text-xs opacity-80">{new Date(shift.date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</p>
      <p className="font-semibold">{shift.label}</p>
      <p className="text-sm opacity-90">{shift.code}</p>
      {shift.startTime && shift.endTime ? (
        <p className="mt-1 text-xs">{shift.startTime}–{shift.endTime}</p>
      ) : (
        <p className="mt-1 text-xs opacity-75">No working hours</p>
      )}
      {shift.note ? <p className="mt-2 text-xs">{shift.note}</p> : null}
    </article>
  );
}
