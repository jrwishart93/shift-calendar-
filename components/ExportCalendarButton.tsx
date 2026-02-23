"use client";

import type { EnrichedShift } from "./types";
import { exportCalendar } from "@/utils/exportCalendar";

export default function ExportCalendarButton({ shifts }: { shifts: EnrichedShift[] }) {
  return (
    <button
      type="button"
      onClick={() => exportCalendar(shifts)}
      className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-base font-semibold text-white shadow-lg shadow-violet-950/30 transition duration-200 hover:brightness-110 active:scale-[0.98] active:brightness-95 sm:w-auto"
    >
      📅 Export to Calendar
    </button>
  );
}
