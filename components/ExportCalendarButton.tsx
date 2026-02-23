"use client";

import type { EnrichedShift } from "./types";
import { exportCalendar } from "@/utils/exportCalendar";

export default function ExportCalendarButton({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <button
      type="button"
      onClick={() => exportCalendar(shifts)}
      className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-800"
    >
      <span aria-hidden="true">📅</span>
      <span className="ml-2">Export to Calendar</span>
    </button>
  );
}
