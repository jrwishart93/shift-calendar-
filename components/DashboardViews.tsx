"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import type { EnrichedShift } from "./types";
import WeekView from "./WeekView";
import MonthCalendar from "./MonthCalendar";
import ViewModeToggle from "./ViewModeToggle";
import ShiftDetailModal from "./ShiftDetailModal";
import ExportCalendarButton from "./ExportCalendarButton";
import ShareButton from "./ShareButton";

type ViewMode = "week" | "month";

const STORAGE_KEY = "viewMode";
const EDITS_STORAGE_KEY = "shiftEdits";

export default function DashboardViews({ shifts, today }: { shifts: EnrichedShift[]; today: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedShift, setSelectedShift] = useState<EnrichedShift | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editedShifts, setEditedShifts] = useState<Record<string, EnrichedShift>>({});

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

    const savedEdits = window.localStorage.getItem(EDITS_STORAGE_KEY);
    if (savedEdits) {
      try {
        setEditedShifts(JSON.parse(savedEdits));
      } catch {
        // Ignore malformed data
      }
    }
  }, []);

  function handleViewModeChange(mode: ViewMode) {
    setViewMode(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }

  const effectiveShifts = useMemo(() => shifts.map((shift) => editedShifts[shift.date] ?? shift), [editedShifts, shifts]);

  const publicLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "shift-calendar.vercel.app/jamie";
    }

    return `${window.location.host}/jamie`;
  }, []);

  return (
    <main className="min-h-screen bg-[#000a24]">
      <Header />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-10 pt-3 sm:px-6">
        <div className="space-y-2">
          <ShareButton />
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-slate-300">{isAdmin ? "Admin mode" : "Viewer mode"}</p>
            <ExportCalendarButton shifts={effectiveShifts} />
          </div>
        </div>

        <div className="rounded-3xl border border-[#2a4269] bg-[#0a1635] p-1">
          <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
        </div>

        {viewMode === "week" ? (
          <WeekView
            shifts={effectiveShifts}
            today={today}
            onDaySelect={(shift, date) => {
              setSelectedShift(shift);
              setSelectedDate(date);
            }}
          />
        ) : (
          <MonthCalendar
            shifts={effectiveShifts}
            isAdmin={isAdmin}
            onDaySelect={(shift, date) => {
              setSelectedShift(shift);
              setSelectedDate(date);
            }}
          />
        )}

        <div className="mx-auto w-full max-w-3xl rounded-full border border-[#2a4269] bg-[#111a3d] px-5 py-3 text-center text-lg text-slate-300">
          {publicLink}
        </div>

        {selectedDate ? (
          <ShiftDetailModal
            date={selectedDate}
            shift={selectedShift}
            isAdmin={isAdmin}
            onClose={() => {
              setSelectedDate(null);
              setSelectedShift(null);
            }}
            onSave={(updated) => {
              setEditedShifts((current) => {
                const next = { ...current, [updated.date]: updated };
                window.localStorage.setItem(EDITS_STORAGE_KEY, JSON.stringify(next));
                return next;
              });
            }}
          />
        ) : null}
      </section>
    </main>
  );
}
