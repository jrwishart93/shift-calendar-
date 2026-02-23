export type CalendarShift = {
  date: string;
  startTime: string | null;
  endTime: string | null;
  label: string;
  code: string;
  note?: string;
  type?: string;
};

const EXCLUDED_TYPES = new Set(["rest", "annual_leave", "service_break"]);

function escapeICSValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function formatICSDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function parseShiftDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

function buildDescription(shift: CalendarShift): string {
  const parts = [shift.code];
  if (shift.note?.trim()) {
    parts.push(shift.note.trim());
  }

  return parts.join(" - ");
}

function getEndDateTime(start: Date, shift: CalendarShift): Date {
  if (!shift.endTime) {
    return start;
  }

  const end = parseShiftDateTime(shift.date, shift.endTime);
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }

  return end;
}

export function generateICS(shifts: CalendarShift[]): string {
  const nowStamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const events = shifts
    .filter((shift) => !EXCLUDED_TYPES.has(shift.type ?? "") && shift.startTime && shift.endTime)
    .map((shift) => {
      const start = parseShiftDateTime(shift.date, shift.startTime as string);
      const end = getEndDateTime(start, shift);
      const uid = `shift-${shift.date}-${shift.code}@shift-calendar`;

      return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART;TZID=Europe/London:${formatICSDateTime(start)}`,
        `DTEND;TZID=Europe/London:${formatICSDateTime(end)}`,
        `SUMMARY:${escapeICSValue(shift.label)}`,
        `DESCRIPTION:${escapeICSValue(buildDescription(shift))}`,
        "END:VEVENT"
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shift Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
    ""
  ].join("\r\n");
}
