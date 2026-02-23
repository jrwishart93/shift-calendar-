import type { EnrichedShift } from "./types";
import { typeColours } from "./shift-utils";

const TRACKED_TYPES: { type: string; label: string }[] = [
  { type: "early", label: "Early" },
  { type: "late", label: "Late" },
  { type: "night", label: "Night" },
  { type: "rest", label: "Rest" },
  { type: "annual_leave", label: "AL" },
  { type: "leave_requested", label: "LR" },
  { type: "toil", label: "TOIL" },
  { type: "public_holiday", label: "PH" },
  { type: "court", label: "Court" },
  { type: "course", label: "Course" },
  { type: "service_break", label: "SB" },
];

export default function MonthStats({ shifts }: { shifts: EnrichedShift[] }) {
  const counts: Record<string, number> = {};

  for (const shift of shifts) {
    counts[shift.type] = (counts[shift.type] ?? 0) + 1;
  }

  const entries = TRACKED_TYPES.filter(({ type }) => (counts[type] ?? 0) > 0);

  if (entries.length === 0) return null;

  return (
    <div className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none]" aria-label="Monthly shift breakdown">
      {entries.map(({ type, label }) => (
        <span
          key={type}
          title={type.replaceAll("_", " ")}
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${typeColours[type] ?? typeColours.unknown}`}
        >
          {label}
          <span className="font-bold">{counts[type]}</span>
        </span>
      ))}
    </div>
  );
}
