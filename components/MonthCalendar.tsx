"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generateMonthGrid } from "@/utils/generateMonthGrid";
import { resolveShift } from "@/utils/resolveShift";
import type { EnrichedShift } from "./types";
import DayCell from "./DayCell";
import MonthStats from "./MonthStats";

type MonthCalendarProps = {
  shifts: EnrichedShift[];
  isAdmin?: boolean;
  onDaySelect?: (shift: EnrichedShift | null, date: string) => void;
};

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});

export default function MonthCalendar({ shifts, isAdmin = false, onDaySelect }: MonthCalendarProps) {
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)));
  const [resolvedShiftsByDate, setResolvedShiftsByDate] = useState<Record<string, EnrichedShift>>({});

  const shiftByDate = useMemo(() => Object.fromEntries(shifts.map((shift) => [shift.date, shift])), [shifts]);
  const weeks = useMemo(() => generateMonthGrid(displayDate.getUTCFullYear(), displayDate.getUTCMonth()), [displayDate]);

  useEffect(() => {
    let active = true;

    async function resolveVisibleMonth() {
      const dates = weeks.flat().map((day) => day.date);
      const resolvedEntries = await Promise.all(
        dates.map(async (date) => {
          const resolved = await resolveShift(date, shiftByDate[date]);
          return [date, resolved] as const;
        }),
      );

      if (!active) {
        return;
      }

      setResolvedShiftsByDate((current) => ({
        ...current,
        ...Object.fromEntries(resolvedEntries),
      }));
    }

    void resolveVisibleMonth();

    return () => {
      active = false;
    };
  }, [shiftByDate, weeks]);

  const monthPrefix = `${String(displayDate.getUTCFullYear())}-${String(displayDate.getUTCMonth() + 1).padStart(2, "0")}`;
  const monthShifts = useMemo(
    () => Object.values(resolvedShiftsByDate).filter((s) => s.date.startsWith(monthPrefix)),
    [resolvedShiftsByDate, monthPrefix],
  );

  const isViewingCurrentMonth =
    displayDate.getUTCFullYear() === today.getUTCFullYear() &&
    displayDate.getUTCMonth() === today.getUTCMonth();

  function moveMonth(offset: number) {
    setDisplayDate((current) => new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + offset, 1)));
  }

  function goToToday() {
    setDisplayDate(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)));
  }

  return (
    <section className="flex h-full flex-col gap-1.5">
      <div className="shrink-0 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#294066] bg-[#08132d] text-slate-200 transition hover:bg-[#0e1e40]"
          aria-label="Go to previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex min-w-0 flex-col items-center gap-0.5">
          <h2 className="text-2xl font-semibold leading-none text-slate-100">{monthFormatter.format(displayDate)}</h2>
          {!isViewingCurrentMonth && (
            <button
              type="button"
              onClick={goToToday}
              className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
            >
              Today
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#294066] bg-[#08132d] text-slate-200 transition hover:bg-[#0e1e40]"
          aria-label="Go to next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="shrink-0">
        <MonthStats shifts={monthShifts} />
      </div>

      <div className="shrink-0 grid grid-cols-7 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="text-[10px] font-semibold tracking-wider text-slate-500 sm:hidden">{d}</span>
        ))}
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
          <span key={d} className="hidden text-[11px] font-semibold tracking-widest text-slate-400 sm:block">{d}</span>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1">
        {weeks.map((week) => (
          <div key={week[0].date} className="grid min-h-0 flex-1 grid-cols-7 gap-1">
            {week.map((day, index) => (
              <DayCell
                key={day.date}
                date={day.date}
                dayNumber={day.dayNumber}
                isCurrentMonth={day.isCurrentMonth}
                isToday={day.isToday}
                isWeekend={index >= 5}
                shift={resolvedShiftsByDate[day.date] ?? null}
                isAdmin={isAdmin}
                onSelect={(shift, date) => onDaySelect?.(shift, date)}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
