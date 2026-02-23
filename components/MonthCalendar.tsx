"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generateMonthGrid } from "@/utils/generateMonthGrid";
import type { EnrichedShift } from "./types";
import DayCell from "./DayCell";
import MonthStats from "./MonthStats";

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

  const monthPrefix = `${String(displayDate.getUTCFullYear())}-${String(displayDate.getUTCMonth() + 1).padStart(2, "0")}`;
  const monthShifts = useMemo(() => shifts.filter((s) => s.date.startsWith(monthPrefix)), [shifts, monthPrefix]);

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
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-4xl font-semibold leading-none text-slate-100">{monthFormatter.format(displayDate)}</h2>
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
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#294066] bg-[#08132d] text-slate-200 transition hover:bg-[#0e1e40]"
          aria-label="Go to next month"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <MonthStats shifts={monthShifts} />

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

      <details className="group rounded-2xl border border-[#1e3460] bg-[#080f28]">
        <summary className="cursor-pointer list-none px-4 py-3 text-xs font-medium text-slate-400 select-none hover:text-slate-200">
          <span className="group-open:hidden">▸ Shift key</span>
          <span className="hidden group-open:inline">▾ Shift key</span>
        </summary>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-4 sm:grid-cols-3">
          {[
            { code: "E / VD", label: "Early Shift", color: "text-emerald-300", dot: "bg-emerald-400" },
            { code: "L / VL", label: "Late Shift", color: "text-amber-300", dot: "bg-amber-400" },
            { code: "N / VN", label: "Night Shift", color: "text-violet-300", dot: "bg-violet-400" },
            { code: "R / RR", label: "Rest Day", color: "text-sky-300", dot: "bg-sky-400" },
            { code: "AL", label: "Annual Leave", color: "text-teal-300", dot: "bg-teal-400" },
            { code: "LR", label: "Leave Requested", color: "text-cyan-300", dot: "bg-cyan-400" },
            { code: "SB", label: "Service Break", color: "text-fuchsia-300", dot: "bg-fuchsia-400" },
            { code: "T", label: "Time Off In Lieu", color: "text-blue-300", dot: "bg-blue-400" },
            { code: "W", label: "Court", color: "text-rose-300", dot: "bg-rose-400" },
            { code: "C", label: "Course", color: "text-orange-300", dot: "bg-orange-400" },
            { code: "PH / A", label: "Public Holiday", color: "text-indigo-300", dot: "bg-indigo-400" },
          ].map(({ code, label, color, dot }) => (
            <div key={code} className="flex items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
              <span className={`text-xs font-bold ${color}`}>{code}</span>
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
