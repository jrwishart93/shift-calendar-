"use client";

import { CalendarDays } from "lucide-react";

import type { EnrichedShift } from "./types";
import { exportCalendar } from "@/utils/exportCalendar";

export default function ExportCalendarButton({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <button
      type="button"
      onClick={() => exportCalendar(shifts)}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-violet-500 px-5 py-2 text-sm font-semibold text-white sm:w-auto"
    >
      <CalendarDays aria-hidden="true" size={17} />
      <span>Export to Calendar</span>
    </button>
  );
}
