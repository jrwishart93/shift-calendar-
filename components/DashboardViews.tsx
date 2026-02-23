"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { EnrichedShift } from "./types";
import WeekView from "./WeekView";
import MonthCalendar from "./MonthCalendar";
import ShiftDetailModal from "./ShiftDetailModal";
import ExportCalendarButton from "./ExportCalendarButton";
import ShareButton from "./ShareButton";
import BottomTabBar, { type TabId } from "./BottomTabBar";
import { useAuth } from "@/hooks/useAuth";
import { saveShiftEdit, subscribeToShiftEdits } from "@/lib/shiftEdits";
import { saveOverride, subscribeToOverrides } from "@/lib/shiftOverrides";
import { updateResolveShiftOverrideCache } from "@/utils/resolveShift";

const STORAGE_KEY = "viewMode";
const EDITS_STORAGE_KEY = "shiftEdits";
const PROFILE_STORAGE_KEY = "userProfile";

type TopTab = "dashboard" | "profile";

type UserProfile = {
  fullName: string;
  email: string;
  shiftPattern: string;
  startupCalendar: TabId;
};

const DEFAULT_PROFILE: UserProfile = {
  fullName: "",
  email: "",
  shiftPattern: "E, L, N, R",
  startupCalendar: "month",
};

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

export default function DashboardViews({
  shifts,
  today,
  calendarName = "Jamie's 2026 Shifts",
  useCorePattern = true,
}: {
  shifts: EnrichedShift[];
  today: string;
  calendarName?: string;
  useCorePattern?: boolean;
}) {
  const [topTab, setTopTab] = useState<TopTab>("dashboard");
  const [activeTab, setActiveTab] = useState<TabId>("month");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [profileSaved, setProfileSaved] = useState(false);
  const [selectedShift, setSelectedShift] = useState<EnrichedShift | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editedShifts, setEditedShifts] = useState<Record<string, EnrichedShift>>({});
  const [overridesByDate, setOverridesByDate] = useState<Record<string, { code: string; note?: string }>>({});
  const { currentUser, signOut } = useAuth();
  const canEdit = Boolean(currentUser);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile) as Partial<UserProfile>;
        const startupCalendar = parsedProfile.startupCalendar;
        const normalizedStartupCalendar = startupCalendar === "week" || startupCalendar === "month" || startupCalendar === "share"
          ? startupCalendar
          : DEFAULT_PROFILE.startupCalendar;

        const nextProfile: UserProfile = {
          fullName: parsedProfile.fullName ?? DEFAULT_PROFILE.fullName,
          email: parsedProfile.email ?? DEFAULT_PROFILE.email,
          shiftPattern: parsedProfile.shiftPattern ?? DEFAULT_PROFILE.shiftPattern,
          startupCalendar: normalizedStartupCalendar,
        };

        setProfile(nextProfile);
        setActiveTab(nextProfile.startupCalendar);
      } catch {
        setProfile(DEFAULT_PROFILE);
      }
    } else {
      const savedMode = window.localStorage.getItem(STORAGE_KEY);
      if (savedMode === "week" || savedMode === "month" || savedMode === "share") {
        setActiveTab(savedMode);
      }
    }

    if (currentUser) {
      setProfile((current) => ({
        ...current,
        fullName: current.fullName || currentUser.displayName || "",
        email: current.email || currentUser.email || "",
      }));
    }

    const unsubscribeShiftEdits = subscribeToShiftEdits(
      (updates) => {
        setEditedShifts(updates);
      },
      () => {
        const savedEdits = window.localStorage.getItem(EDITS_STORAGE_KEY);
        if (!savedEdits) {
          return;
        }

        try {
          setEditedShifts(JSON.parse(savedEdits));
        } catch {
          // ignore malformed data
        }
      },
    );

    const unsubscribeOverrides = subscribeToOverrides((updates) => {
      setOverridesByDate(updates);
      updateResolveShiftOverrideCache(updates);
      console.log("[DashboardViews] overrides updated", Object.keys(updates).length);
    });

    return () => {
      unsubscribeShiftEdits();
      unsubscribeOverrides();
    };
  }, [currentUser]);


  useEffect(() => {
    updateResolveShiftOverrideCache(overridesByDate);
  }, [overridesByDate]);

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    window.localStorage.setItem(STORAGE_KEY, tab);
  }

  function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.localStorage.setItem(STORAGE_KEY, profile.startupCalendar);
    setActiveTab(profile.startupCalendar);
    setProfileSaved(true);
    window.setTimeout(() => {
      setProfileSaved(false);
    }, 2500);
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
            <h1 className="text-lg font-bold leading-none text-slate-100">{calendarName}</h1>
            <p className="mt-0.5 text-[11px] text-slate-500">Shift rota</p>
          </div>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                  Signed in
                </span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="rounded-lg border border-[#2a4269] px-2.5 py-1 text-xs text-slate-300 transition hover:bg-[#111a3d]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login?next=/dashboard"
                className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
              >
                Sign in to edit
              </Link>
            )}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-6xl gap-2 px-4 pb-3 sm:px-6">
          <button
            type="button"
            onClick={() => setTopTab("dashboard")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              topTab === "dashboard"
                ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40"
                : "bg-[#111a3d] text-slate-300"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setTopTab("profile")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              topTab === "profile"
                ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40"
                : "bg-[#111a3d] text-slate-300"
            }`}
          >
            User profile
          </button>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-hidden px-3 pt-2 sm:px-4">
        {topTab === "dashboard" && activeTab === "month" && (
          <div className="h-full">
            <MonthCalendar
              shifts={effectiveShifts}
              useCorePattern={useCorePattern}
              isAdmin={canEdit}
              onDaySelect={(shift, date) => {
                setSelectedShift(shift);
                setSelectedDate(date);
              }}
            />
          </div>
        )}

        {topTab === "dashboard" && activeTab === "week" && (
          <div className="h-full overflow-y-auto pb-2">
            <WeekView
              shifts={effectiveShifts}
              today={today}
              useCorePattern={useCorePattern}
              onDaySelect={(shift, date) => {
                setSelectedShift(shift);
                setSelectedDate(date);
              }}
            />
          </div>
        )}

        {topTab === "dashboard" && activeTab === "share" && (
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

        {topTab === "profile" && (
          <div className="mx-auto w-full max-w-3xl overflow-y-auto pb-10">
            <form onSubmit={handleProfileSave} className="space-y-4 rounded-2xl border border-[#2a4269] bg-[#0a1635] p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">User profile</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update your details and choose which calendar view opens by default.
                </p>
              </div>

              <label className="block text-sm text-slate-200">
                Full name
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="Your name"
                  className="mt-1 w-full rounded-lg border border-[#2a4269] bg-[#111a3d] px-3 py-2 text-sm text-slate-100"
                />
              </label>

              <label className="block text-sm text-slate-200">
                Email
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-[#2a4269] bg-[#111a3d] px-3 py-2 text-sm text-slate-100"
                />
              </label>

              <label className="block text-sm text-slate-200">
                Shift pattern
                <textarea
                  value={profile.shiftPattern}
                  onChange={(event) => setProfile((current) => ({ ...current, shiftPattern: event.target.value }))}
                  placeholder="e.g. E, E, L, L, N, N, R, R"
                  className="mt-1 min-h-24 w-full rounded-lg border border-[#2a4269] bg-[#111a3d] px-3 py-2 text-sm text-slate-100"
                />
              </label>

              <label className="block text-sm text-slate-200">
                Startup calendar
                <select
                  value={profile.startupCalendar}
                  onChange={(event) => setProfile((current) => ({ ...current, startupCalendar: event.target.value as TabId }))}
                  className="mt-1 w-full rounded-lg border border-[#2a4269] bg-[#111a3d] px-3 py-2 text-sm text-slate-100"
                >
                  <option value="month">Calendar (month)</option>
                  <option value="week">Week view</option>
                  <option value="share">Share</option>
                </select>
              </label>

              <button
                type="submit"
                className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
              >
                Save profile
              </button>

              {profileSaved ? <p className="text-xs text-emerald-300">Profile saved successfully.</p> : null}
            </form>
          </div>
        )}

        {selectedDate ? (
          <ShiftDetailModal
            date={selectedDate}
            shift={selectedShift}
            isAdmin={canEdit}
            onClose={() => {
              setSelectedDate(null);
              setSelectedShift(null);
            }}
            onSave={async (updated) => {
              if (!canEdit) {
                throw new Error("Please sign in to edit and save shifts.");
              }

              const hasStoredShift = Boolean(shifts.find((shift) => shift.date === updated.date) || editedShifts[updated.date]);
              if (hasStoredShift) {
                console.log("[DashboardViews] saving stored shift edit", updated.date);
                setEditedShifts((current) => {
                  const next = { ...current, [updated.date]: updated };
                  window.localStorage.setItem(EDITS_STORAGE_KEY, JSON.stringify(next));
                  return next;
                });

                await saveShiftEdit(updated);
                return;
              }

              console.log("[DashboardViews] saving generated day as override", updated.date);
              await saveOverride(updated.date, {
                code: updated.code,
                note: updated.note,
              });

              setOverridesByDate((current) => ({
                ...current,
                [updated.date]: {
                  code: updated.code,
                  note: updated.note,
                },
              }));
            }}
          />
        ) : null}
      </section>

      {topTab === "dashboard" ? <BottomTabBar activeTab={activeTab} onChange={handleTabChange} /> : null}
    </main>
  );
}
