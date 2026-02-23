import type { EnrichedShift } from "./types";
import { getDayCellStyles } from "./shift-utils";

type DayCellProps = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  shift: EnrichedShift | null;
  isAdmin: boolean;
  onSelect: (shift: EnrichedShift | null, date: string) => void;
};

export default function DayCell({
  date,
  dayNumber,
  isCurrentMonth,
  isToday,
  isWeekend,
  shift,
  isAdmin,
  onSelect
}: DayCellProps) {
  const styles = getDayCellStyles(shift?.type);

  const ariaParts = [
    new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long"
    })
  ];

  if (shift) {
    ariaParts.push(`${shift.label} (${shift.code})`);
    if (shift.startTime && shift.endTime) {
      ariaParts.push(`${shift.startTime} to ${shift.endTime}`);
    }
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(shift, date)}
      className={`relative min-h-[118px] rounded-2xl border p-2.5 text-left transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
        isCurrentMonth ? styles.card : "border-slate-800 bg-[#070f23] text-slate-600"
      } ${isWeekend ? "shadow-[inset_0_0_0_1px_rgba(148,163,184,0.04)]" : ""}`}
      aria-label={`${ariaParts.join(", ")}. ${isAdmin ? "Admin editable" : "Viewer read only"}`}
    >
      <span className={`${isCurrentMonth ? "text-slate-300" : "text-slate-600"} text-xs font-semibold`}>{dayNumber}</span>
      {isToday ? <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-cyan-300" /> : null}
      {shift?.note ? (
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" title="Has note" />
      ) : null}
      {shift ? (
        <div className="mt-2">
          <p className={`text-[38px] font-bold leading-none tracking-tight ${styles.code}`}>{shift.code}</p>
          <p className={`mt-1 text-xs ${styles.time}`}>{shift.startTime && shift.endTime ? `${shift.startTime}–${shift.endTime}` : "—"}</p>
        </div>
      ) : (
        <p className="mt-7 text-sm text-slate-500">—</p>
      )}
    </button>
  );
}
