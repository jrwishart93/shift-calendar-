"use client";

import { useEffect, useMemo, useState } from "react";
import type { EnrichedShift } from "./types";
import WeekView from "./WeekView";
import MonthCalendar from "./MonthCalendar";
import ShiftDetailModal from "./ShiftDetailModal";
import ExportCalendarButton from "./ExportCalendarButton";
import ShareButton from "./ShareButton";
import BottomTabBar, { type TabId } from "./BottomTabBar";

const STORAGE_KEY = "viewMode";
const EDITS_STORAGE_KEY = "shiftEdits";

export default function DashboardViews({ shifts, today }: { shifts: EnrichedShift[]; today: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("month");
  const [selectedShift, setSelectedShift] = useState<EnrichedShift | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editedShifts, setEditedShifts] = useState<Record<string, EnrichedShift>>({});

  const isAdmin = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("role") === "admin";
  }, []);

  useEffect(() => {
    const savedMode = window.localStorage.getItem(STORAGE_KEY);
    if (savedMode === "week" || savedMode === "month" || savedMode === "share") {
      setActiveTab(savedMode);
    }

    const savedEdits = window.localStorage.getItem(EDITS_STORAGE_KEY);
    if (savedEdits) {
      try {
        setEditedShifts(JSON.parse(savedEdits));
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    window.localStorage.setItem(STORAGE_KEY, tab);
  }

  const effectiveShifts = useMemo(
    () => shifts.map((shift) => editedShifts[shift.date] ?? shift),
    [editedShifts, shifts]
  );

  const publicLink = useMemo(() => {
    if (typeof window === "undefined") return "shift-calendar.vercel.app/jamie";
    return `${window.location.host}/jamie`;
  }, []);

  return (
    <main className="min-h-screen bg-[#000a24]">
      <header className="sticky top-0 z-10 border-b border-[#1f3760] bg-[#000a24]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold leading-none text-slate-100">Jamie's 2026 Shifts</h1>
            <p className="mt-0.5 text-xs text-slate-500">Shift rota</p>
          </div>
          {isAdmin && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
              Admin
            </span>
          )}
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-28 pt-3 sm:px-6">
        {activeTab === "month" && (
          <MonthCalendar
            shifts={effectiveShifts}
            isAdmin={isAdmin}
            onDaySelect={(shift, date) => {
              setSelectedShift(shift);
              setSelectedDate(date);
            }}
          />
        )}

        {activeTab === "week" && (
          <WeekView
            shifts={effectiveShifts}
            today={today}
            onDaySelect={(shift, date) => {
              setSelectedShift(shift);
              setSelectedDate(date);
            }}
          />
        )}

        {activeTab === "share" && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl border border-[#2a4269] bg-[#0a1635] p-5">
              <h2 className="text-lg font-semibold text-slate-100">Public link</h2>
              <p className="text-sm text-slate-400">Share your upcoming shifts with family or friends.</p>
              <ShareButton />
              <div className="break-all rounded-xl border border-[#2a4269] bg-[#111a3d] px-4 py-3 font-mono text-sm text-slate-300">
                {publicLink}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#2a4269] bg-[#0a1635] p-5">
              <h2 className="text-lg font-semibold text-slate-100">Export to calendar</h2>
              <p className="text-sm text-slate-400">
                Download your shifts as an ICS file for Google Calendar, Apple Calendar, or Outlook.
              </p>
              <ExportCalendarButton shifts={effectiveShifts} />
            </div>
          </div>
        )}

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

      <BottomTabBar activeTab={activeTab} onChange={handleTabChange} />
    </main>
  );
}
