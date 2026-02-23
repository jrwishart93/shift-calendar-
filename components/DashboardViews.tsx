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

const SHIFT_LEGEND = [
  { code: "E / VD", label: "Early Shift",      color: "text-emerald-300", dot: "bg-emerald-400" },
  { code: "L / VL", label: "Late Shift",       color: "text-amber-300",   dot: "bg-amber-400"   },
  { code: "N / VN", label: "Night Shift",      color: "text-violet-300",  dot: "bg-violet-400"  },
  { code: "R / RR", label: "Rest Day",         color: "text-sky-300",     dot: "bg-sky-400"     },
  { code: "AL",     label: "Annual Leave",     color: "text-teal-300",    dot: "bg-teal-400"    },
  { code: "LR",     label: "Leave Requested",  color: "text-cyan-300",    dot: "bg-cyan-400"    },
  { code: "SB",     label: "Service Break",    color: "text-fuchsia-300", dot: "bg-fuchsia-400" },
  { code: "T",      label: "Time Off In Lieu", color: "text-blue-300",    dot: "bg-blue-400"    },
  { code: "W",      label: "Court",            color: "text-rose-300",    dot: "bg-rose-400"    },
  { code: "C",      label: "Course",           color: "text-orange-300",  dot: "bg-orange-400"  },
  { code: "PH / A", label: "Public Holiday",   color: "text-indigo-300",  dot: "bg-indigo-400"  },
] as const;

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
    <main className="flex h-dvh flex-col bg-[#000a24]">
      <header className="shrink-0 border-b border-[#1f3760] bg-[#000a24]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-bold leading-none text-slate-100">Jamie's 2026 Shifts</h1>
            <p className="mt-0.5 text-[11px] text-slate-500">Shift rota</p>
          </div>
          {isAdmin && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
              Admin
            </span>
          )}
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-hidden px-3 pt-2 sm:px-4">
        {activeTab === "month" && (
          <div className="h-full">
            <MonthCalendar
              shifts={effectiveShifts}
              isAdmin={isAdmin}
              onDaySelect={(shift, date) => {
                setSelectedShift(shift);
                setSelectedDate(date);
              }}
            />
          </div>
        )}

        {activeTab === "week" && (
          <div className="h-full overflow-y-auto pb-2">
            <WeekView
              shifts={effectiveShifts}
              today={today}
              onDaySelect={(shift, date) => {
                setSelectedShift(shift);
                setSelectedDate(date);
              }}
            />
          </div>
        )}

        {activeTab === "share" && (
          <div className="h-full overflow-y-auto pb-2 space-y-4">
            <details className="group rounded-2xl border border-[#2a4269] bg-[#0a1635]">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-100 select-none hover:text-white">
                <span className="group-open:hidden">▸ Shift key / legend</span>
                <span className="hidden group-open:inline">▾ Shift key / legend</span>
              </summary>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-4 sm:grid-cols-3">
                {SHIFT_LEGEND.map(({ code, label, color, dot }) => (
                  <div key={code} className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                    <span className={`text-xs font-bold ${color}`}>{code}</span>
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </details>

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
