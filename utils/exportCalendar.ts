import type { CalendarShift } from "./generateICS";
import { generateICS } from "./generateICS";

export function exportCalendar(shifts: CalendarShift[]): void {
  const ics = generateICS(shifts);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "shift-calendar-2026.ics";
  downloadLink.click();

  URL.revokeObjectURL(url);
}
