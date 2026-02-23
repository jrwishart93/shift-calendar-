"use client";

import { useEffect, useMemo, useState } from "react";
import type { EnrichedShift } from "./types";
import WeekView from "./WeekView";
import MonthCalendar from "./MonthCalendar";
import ViewModeToggle from "./ViewModeToggle";

type ViewMode = "week" | "month";

const STORAGE_KEY = "viewMode";

export default function DashboardViews({ shifts, today }: { shifts: EnrichedShift[]; today: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedShift, setSelectedShift] = useState<EnrichedShift | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const isAdmin = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return new URLSearchParams(window.location.search).get("role") === "admin";
  }, []);

  useEffect(() => {
    const savedMode = window.localStorage.getItem(STORAGE_KEY);
    if (savedMode === "week" || savedMode === "month") {
      setViewMode(savedMode);
    }
  }, []);

  function handleViewModeChange(mode: ViewMode) {
    setViewMode(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }

  const startIdx = Math.max(0, shifts.findIndex((shift) => shift.date >= today));

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Monthly shifts</h2>
        <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
      </div>
      {viewMode === "week" ? (
        <WeekView shifts={shifts.slice(startIdx, startIdx + 7)} />
      ) : (
        <MonthCalendar
          shifts={shifts}
          isAdmin={isAdmin}
          onDaySelect={(shift, date) => {
            setSelectedShift(shift);
            setSelectedDate(date);
          }}
        />
      )}

      {selectedDate ? (
        <dialog open className="fixed inset-0 z-20 m-0 flex h-full w-full items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100">
            <p className="text-xs uppercase tracking-wide text-slate-400">{isAdmin ? "Admin edit mode" : "Read only mode"}</p>
            <h3 className="mt-1 text-lg font-semibold">{selectedDate}</h3>
            {selectedShift ? (
              <>
                <p className="mt-2 text-sm">{selectedShift.label} ({selectedShift.code})</p>
                {selectedShift.startTime && selectedShift.endTime ? (
                  <p className="text-sm text-slate-300">{selectedShift.startTime}–{selectedShift.endTime}</p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-300">No shift assigned.</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedShift(null);
                }}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
              >
                Close
              </button>
              {isAdmin ? <button type="button" className="rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-slate-950">Edit shift</button> : null}
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
