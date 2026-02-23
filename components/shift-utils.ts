import { shiftMap } from "@/data/shiftMap";
import type { EnrichedShift, RawShift } from "./types";

export const typeColours: Record<string, string> = {
  early: "bg-green-500/20 text-green-300 border-green-500/40",
  late: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  night: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  rest: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  annual_leave: "bg-teal-500/20 text-teal-300 border-teal-500/40",
  leave_requested: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  court: "bg-red-500/20 text-red-300 border-red-500/40",
  course: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  toil: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  public_holiday: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
  unknown: "bg-slate-600/20 text-slate-300 border-slate-500/40"
};

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
