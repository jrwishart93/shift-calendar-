"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generateMonthGrid } from "@/utils/generateMonthGrid";
import type { EnrichedShift } from "./types";
import DayCell from "./DayCell";

type MonthCalendarProps = {
  shifts: EnrichedShift[];
  isAdmin?: boolean;
  onDaySelect?: (shift: EnrichedShift | null, date: string) => void;
};

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});

export default function MonthCalendar({ shifts, isAdmin = false, onDaySelect }: MonthCalendarProps) {
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)));

  const shiftByDate = useMemo(() => Object.fromEntries(shifts.map((shift) => [shift.date, shift])), [shifts]);

  const weeks = useMemo(() => generateMonthGrid(displayDate.getUTCFullYear(), displayDate.getUTCMonth()), [displayDate]);

  function moveMonth(offset: number) {
    setDisplayDate((current) => new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + offset, 1)));
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#294066] bg-[#08132d] text-slate-200 transition hover:bg-[#0e1e40]"
          aria-label="Go to previous month"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-4xl font-semibold leading-none text-slate-100">{monthFormatter.format(displayDate)}</h2>
        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#294066] bg-[#08132d] text-slate-200 transition hover:bg-[#0e1e40]"
          aria-label="Go to next month"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold tracking-[0.12em] text-slate-400">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="space-y-2">
        {weeks.map((week) => (
          <div key={week[0].date} className="grid grid-cols-7 gap-2">
            {week.map((day, index) => (
              <DayCell
                key={day.date}
                date={day.date}
                dayNumber={day.dayNumber}
                isCurrentMonth={day.isCurrentMonth}
                isToday={day.isToday}
                isWeekend={index >= 5}
                shift={shiftByDate[day.date] ?? null}
                isAdmin={isAdmin}
                onSelect={(shift, date) => onDaySelect?.(shift, date)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Example screenshot: ![Month calendar mobile](artifacts/month-mobile-v2.png) */}
    </section>
  );
}
