"use client";

import type { EnrichedShift } from "./types";
import { exportCalendar } from "@/utils/exportCalendar";

export default function ExportCalendarButton({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <button
      type="button"
      onClick={() => exportCalendar(shifts)}
      className="w-full rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white sm:w-auto"
    >
      📅 Export to Calendar
    </button>
  );
}
