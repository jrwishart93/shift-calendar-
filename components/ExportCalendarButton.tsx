"use client";

import type { EnrichedShift } from "./types";
import { exportCalendar } from "@/utils/exportCalendar";

export default function ExportCalendarButton({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <button
      type="button"
      onClick={() => exportCalendar(shifts)}
      className="w-full min-h-[44px] rounded-lg bg-violet-500 px-4 py-2 text-base font-semibold text-white transition active:scale-[0.98] active:bg-violet-400 sm:w-auto"
    >
      📅 Export to Calendar
    </button>
  );
}
