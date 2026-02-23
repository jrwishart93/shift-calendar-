import { shiftMap } from "@/data/shiftMap";
import type { EnrichedShift, RawShift } from "./types";

export const typeColours: Record<string, string> = {
  early: "bg-blue-500/15 text-blue-200 border-blue-400/45 shadow-[0_0_16px_rgba(59,130,246,0.2)]",
  late: "bg-indigo-500/15 text-indigo-200 border-indigo-400/45 shadow-[0_0_16px_rgba(99,102,241,0.2)]",
  night: "bg-violet-500/18 text-violet-200 border-violet-400/45 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
  rest: "bg-sky-500/12 text-sky-200 border-sky-400/35",
  annual_leave: "bg-teal-500/18 text-teal-200 border-teal-400/45 shadow-[0_0_16px_rgba(20,184,166,0.25)]",
  leave_requested: "bg-cyan-500/15 text-cyan-200 border-cyan-400/40",
  court: "bg-rose-500/15 text-rose-200 border-rose-400/40",
  course: "bg-amber-500/15 text-amber-200 border-amber-400/40",
  toil: "bg-blue-500/20 text-blue-100 border-blue-300/50 shadow-[0_0_18px_rgba(59,130,246,0.28)]",
  public_holiday: "bg-fuchsia-500/16 text-fuchsia-200 border-fuchsia-400/40",
  unknown: "bg-slate-500/15 text-slate-200 border-slate-400/35"
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
