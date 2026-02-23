"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EnrichedShift } from "./types";
import { typeColours } from "./shift-utils";
import { resolveShift } from "@/utils/resolveShift";

type WeekViewProps = {
  shifts: EnrichedShift[];
  today: string;
  useCorePattern?: boolean;
  onDaySelect?: (shift: EnrichedShift | null, date: string) => void;
};

function getStartOfWeek(date: string): Date {
  const current = new Date(`${date}T00:00:00Z`);
  const day = current.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  current.setUTCDate(current.getUTCDate() + offset);
  return current;
}

export default function WeekView({ shifts, today, useCorePattern = true, onDaySelect }: WeekViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [weekShifts, setWeekShifts] = useState<(EnrichedShift | null)[]>([]);

  const shiftByDate = useMemo(() => Object.fromEntries(shifts.map((shift) => [shift.date, shift])), [shifts]);

  const visibleDates = useMemo(() => {
    const startOfWeek = getStartOfWeek(today);

    return Array.from({ length: 7 }, (_, index) => {
      const next = new Date(startOfWeek);
      next.setUTCDate(startOfWeek.getUTCDate() + index);
      return next.toISOString().slice(0, 10);
    });
  }, [today]);

  useEffect(() => {
    let active = true;

    async function resolveVisibleWeek() {
      const resolved = await Promise.all(
        visibleDates.map((date) => resolveShift(date, shiftByDate[date], useCorePattern)),
      );

      if (!active) {
        return;
      }

      setWeekShifts(resolved);
    }

    void resolveVisibleWeek();

    return () => {
      active = false;
    };
  }, [useCorePattern, visibleDates, shiftByDate]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
  }, [weekShifts]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
      <h2 className="mb-3 text-base font-semibold text-white">Week view</h2>
      <div ref={containerRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1" aria-label="Weekly shift cards">
        {weekShifts.map((shift, index) => {
          const date = visibleDates[index];

          if (!shift) {
            return (
              <button
                key={date}
                type="button"
                onClick={() => onDaySelect?.(null, date)}
                className="w-[260px] shrink-0 snap-center rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-left text-slate-200 transition hover:border-slate-500"
              >
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                </p>
                <p className="mt-2 text-2xl font-bold leading-none">—</p>
                <p className="mt-1 text-sm text-slate-400">No shift added</p>
                <p className="mt-2 text-xs text-slate-500">Tap to add your own shift</p>
              </button>
            );
          }

          return (
            <button
              key={shift.date}
            type="button"
            onClick={() => onDaySelect?.(shift, shift.date)}
            className={`w-[260px] shrink-0 snap-center rounded-xl border p-3 text-left transition hover:border-slate-500 ${
              typeColours[shift.type] ?? typeColours.unknown
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-300">
              {new Date(`${shift.date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
            </p>
            <p className="mt-2 text-2xl font-bold leading-none">{shift.code}</p>
            <p className="mt-1 text-sm text-slate-200">{shift.label}</p>
            <p className="mt-2 text-xs text-slate-300">{shift.startTime && shift.endTime ? `${shift.startTime}–${shift.endTime}` : "—"}</p>
          </button>
          );
        })}
      </div>
    </section>
  );
}
