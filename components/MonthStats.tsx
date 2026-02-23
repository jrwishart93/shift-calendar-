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

  const workingDays = shifts.filter(
    (s) => s.startTime && s.endTime && !["rest", "service_break"].includes(s.type)
  ).length;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5" aria-label="Monthly shift breakdown">
        {entries.map(({ type, label }) => (
          <span
            key={type}
            title={type.replaceAll("_", " ")}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeColours[type] ?? typeColours.unknown}`}
          >
            {label}
            <span className="font-bold">{counts[type]}</span>
          </span>
        ))}
      </div>
      {workingDays > 0 && (
        <p className="text-xs text-slate-400">{workingDays} working day{workingDays !== 1 ? "s" : ""} this month</p>
      )}
    </div>
  );
}
