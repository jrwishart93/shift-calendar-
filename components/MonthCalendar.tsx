"use client";

import { useMemo, useState } from "react";
import { generateMonthGrid } from "@/utils/generateMonthGrid";
import { typeColours } from "./shift-utils";
import type { EnrichedShift } from "./types";

type MonthCalendarProps = {
  shifts: EnrichedShift[];
  isAdmin?: boolean;
  onDaySelect?: (shift: EnrichedShift | null, date: string) => void;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});

export default function MonthCalendar({ shifts, isAdmin = false, onDaySelect }: MonthCalendarProps) {
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)));

  const shiftByDate = useMemo(
    () => Object.fromEntries(shifts.map((shift) => [shift.date, shift])),
    [shifts]
  );

  const weeks = useMemo(
    () => generateMonthGrid(displayDate.getUTCFullYear(), displayDate.getUTCMonth()),
    [displayDate]
  );

  const monthLabel = monthFormatter.format(displayDate);

  function moveMonth(offset: number) {
    setDisplayDate((current) => new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + offset, 1)));
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-700 px-4 text-base text-slate-200 transition hover:bg-slate-800 active:scale-[0.98] active:bg-slate-700"
          aria-label="Go to previous month"
        >
          ←
        </button>
        <h2 className="text-base font-semibold">{monthLabel}</h2>
        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-700 px-4 text-base text-slate-200 transition hover:bg-slate-800 active:scale-[0.98] active:bg-slate-700"
          aria-label="Go to next month"
        >
          →
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid gap-1">
        {weeks.map((week) => (
          <div key={week[0].date} className="grid grid-cols-7 gap-1">
            {week.map((day) => {
              const shift = shiftByDate[day.date];
              const ariaParts = [new Date(`${day.date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })];

              if (shift) {
                ariaParts.push(shift.label);
                if (shift.startTime && shift.endTime) {
                  ariaParts.push(`${shift.startTime} to ${shift.endTime}`);
                }
              }

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => onDaySelect?.(shift ?? null, day.date)}
                  className={`relative min-h-24 rounded-lg border border-slate-800 p-1.5 text-left transition hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    day.isCurrentMonth ? "bg-slate-900" : "bg-slate-900/50 text-slate-500"
                  } ${shift ? typeColours[shift.type] ?? typeColours.unknown : ""}`}
                  aria-label={`${ariaParts.join(", ")}. ${isAdmin ? "Admin edit mode" : "Read only mode"}`}
                >
                  <span className="text-xs font-semibold">{day.dayNumber}</span>
                  {day.isToday ? <span className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-cyan-400" /> : null}
                  {shift ? (
                    <div className="mt-2">
                      <p className="truncate text-sm font-semibold leading-tight">{shift.code}</p>
                      {shift.startTime && shift.endTime ? (
                        <p className="text-xs text-slate-300">{shift.startTime}–{shift.endTime}</p>
                      ) : (
                        <p className="text-xs text-slate-400">—</p>
                      )}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
