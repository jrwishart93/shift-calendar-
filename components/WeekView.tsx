"use client";

import { useEffect, useMemo, useRef } from "react";
import type { EnrichedShift } from "./types";
import { typeColours } from "./shift-utils";

type WeekViewProps = {
  shifts: EnrichedShift[];
  today: string;
  onDaySelect?: (shift: EnrichedShift | null, date: string) => void;
};

export default function WeekView({ shifts, today, onDaySelect }: WeekViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const todayIndex = useMemo(() => shifts.findIndex((shift) => shift.date >= today), [shifts, today]);

  useEffect(() => {
    if (!containerRef.current || todayIndex < 0) {
      return;
    }

    const cardWidth = 260;
    containerRef.current.scrollTo({ left: todayIndex * (cardWidth + 12), behavior: "smooth" });
  }, [todayIndex]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
      <h2 className="mb-3 text-base font-semibold text-white">Week view</h2>
      <div ref={containerRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1" aria-label="Weekly shift cards">
        {shifts.map((shift) => (
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
        ))}
      </div>
    </section>
  );
}
