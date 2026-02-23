"use client";

import { useMemo, useState } from "react";
import type { EnrichedShift } from "./types";
import { typeColours } from "./shift-utils";

type WeekViewProps = {
  shifts: EnrichedShift[];
  today: string;
  onDaySelect?: (shift: EnrichedShift | null, date: string) => void;
};

export default function WeekView({ shifts, today, onDaySelect }: WeekViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const shiftsByDate = useMemo(() => {
    return new Map(shifts.map((shift) => [shift.date, shift]));
  }, [shifts]);

  const baseDate = useMemo(() => {
    const parsed = new Date(`${today}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [today]);

  const weekStart = useMemo(() => {
    const next = new Date(baseDate);
    next.setUTCDate(baseDate.getUTCDate() + weekOffset * 7);

    const weekday = next.getUTCDay();
    const daysFromMonday = (weekday + 6) % 7;
    next.setUTCDate(next.getUTCDate() - daysFromMonday);
    return next;
  }, [baseDate, weekOffset]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(weekStart);
      day.setUTCDate(weekStart.getUTCDate() + index);
      const date = day.toISOString().slice(0, 10);
      return {
        date,
        shift: shiftsByDate.get(date) ?? null,
      };
    });
  }, [weekStart, shiftsByDate]);

  const weekTitle = useMemo(() => {
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
    return `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }, [weekStart]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-white">Week view</h2>
          <p className="text-xs text-slate-400">{weekTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((current) => current - 1)}
            className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:border-slate-500"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:border-slate-500"
          >
            This week
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((current) => current + 1)}
            className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:border-slate-500"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1" aria-label="Weekly shift cards">
        {weekDays.map(({ date, shift }) => (
          <button
            key={date}
            type="button"
            onClick={() => onDaySelect?.(shift, date)}
            className={`w-[220px] shrink-0 snap-center rounded-xl border p-3 text-left transition hover:border-slate-500 ${
              shift ? (typeColours[shift.type] ?? typeColours.unknown) : "border-slate-700 bg-slate-800 text-slate-300"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-300">
              {new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
            </p>
            <p className="mt-2 text-2xl font-bold leading-none">{shift?.code ?? "—"}</p>
            <p className="mt-1 text-sm text-slate-200">{shift?.label ?? "No shift assigned"}</p>
            <p className="mt-2 text-xs text-slate-300">{shift?.startTime && shift.endTime ? `${shift.startTime}–${shift.endTime}` : "—"}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
