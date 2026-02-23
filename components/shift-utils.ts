import { shiftMap } from "@/data/shiftMap";
import type { EnrichedShift, RawShift } from "./types";

export const typeColours: Record<string, string> = {
  early: "border-emerald-300/35 bg-emerald-500/12 text-emerald-100",
  late: "border-amber-300/35 bg-amber-500/12 text-amber-100",
  night: "border-violet-300/45 bg-violet-500/20 text-violet-100",
  rest: "border-sky-300/30 bg-sky-500/10 text-sky-100",
  annual_leave: "border-teal-300/40 bg-teal-500/16 text-teal-100",
  leave_requested: "border-cyan-300/40 bg-cyan-500/14 text-cyan-100",
  court: "border-rose-300/45 bg-rose-500/18 text-rose-100",
  course: "border-orange-300/40 bg-orange-500/14 text-orange-100",
  service_break: "border-fuchsia-300/35 bg-fuchsia-500/14 text-fuchsia-100",
  toil: "border-blue-300/40 bg-blue-500/16 text-blue-100",
  public_holiday: "border-indigo-300/40 bg-indigo-500/16 text-indigo-100",
  unknown: "border-slate-400/20 bg-slate-500/10 text-slate-200"
};

const dayCellStyles: Record<string, { card: string; code: string; time: string }> = {
  early: { card: "bg-[#0c1d3c] border-[#223a62]", code: "text-emerald-300", time: "text-slate-300" },
  late: { card: "bg-[#0f1b35] border-[#24375f]", code: "text-amber-300", time: "text-slate-300" },
  night: { card: "bg-violet-500/24 border-violet-400/45", code: "text-violet-200", time: "text-violet-100" },
  rest: { card: "bg-[#0b1730] border-[#22385d]", code: "text-sky-300", time: "text-slate-400" },
  annual_leave: { card: "bg-teal-500/18 border-teal-300/35", code: "text-teal-200", time: "text-slate-200" },
  leave_requested: { card: "bg-cyan-500/16 border-cyan-300/35", code: "text-cyan-200", time: "text-slate-200" },
  court: { card: "bg-rose-500/18 border-rose-300/40", code: "text-rose-200", time: "text-slate-200" },
  course: { card: "bg-orange-500/16 border-orange-300/35", code: "text-orange-200", time: "text-slate-200" },
  service_break: { card: "bg-fuchsia-500/16 border-fuchsia-300/35", code: "text-fuchsia-200", time: "text-slate-200" },
  toil: { card: "bg-blue-500/16 border-blue-300/35", code: "text-blue-200", time: "text-slate-200" },
  public_holiday: { card: "bg-indigo-500/16 border-indigo-300/35", code: "text-indigo-200", time: "text-slate-200" },
  unknown: { card: "bg-[#0b1730] border-[#233656]", code: "text-slate-300", time: "text-slate-400" }
};

export function getDayCellStyles(type?: string) {
  return dayCellStyles[type ?? "unknown"] ?? dayCellStyles.unknown;
}

export function enrichShift(shift: RawShift): EnrichedShift {
  const map = shiftMap[shift.code];

  return {
    ...shift,
    label: map?.label ?? shift.code,
    type: map?.type ?? "unknown",
    startTime: map?.start ?? null,
    endTime: map?.end ?? null
  };
}
