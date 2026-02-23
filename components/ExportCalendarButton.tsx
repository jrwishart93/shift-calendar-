"use client";

import { CalendarDays } from "lucide-react";

import type { EnrichedShift } from "./types";
import { exportCalendar } from "@/utils/exportCalendar";

export default function ExportCalendarButton({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <button
      type="button"
      onClick={() => exportCalendar(shifts)}
      className="inline-flex min-h-[36px] items-center justify-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800"
    >
      <CalendarDays aria-hidden="true" size={17} />
      <span>Export Calendar</span>
    </button>
  );
}
