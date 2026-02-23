"use client";

import { useEffect, useMemo, useState } from "react";
import { initFirebaseAnalytics } from "@/app/firebase";

type CalendarType = "work" | "personal" | "children";

type Member = {
  id: string;
  name: string;
  relationship: string;
};

type CalendarEntry = {
  id: string;
  title: string;
  date: string;
  calendarType: CalendarType;
  ownerId: string;
  note: string;
  marked: boolean;
};

const CALENDAR_LABELS: Record<CalendarType, string> = {
  work: "Work",
  personal: "Personal",
  children: "Children",
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function MultiLevelCalendarApp() {
  const [userName, setUserName] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [members, setMembers] = useState<Member[]>([
    { id: "me", name: "Me", relationship: "Primary user" },
    { id: "partner", name: "Partner", relationship: "Spouse / partner" },
    { id: "child-1", name: "Child", relationship: "Child" },
  ]);

  const [entries, setEntries] = useState<CalendarEntry[]>([
    {
      id: makeId(),
      title: "Morning shift",
      date: "2026-01-06",
      calendarType: "work",
      ownerId: "me",
      note: "Start at 7:00. Bring reports.",
      marked: true,
    },
    {
      id: makeId(),
      title: "Date night",
      date: "2026-01-07",
      calendarType: "personal",
      ownerId: "partner",
      note: "Book babysitter by Tuesday.",
      marked: false,
    },
  ]);

  const [selectedView, setSelectedView] = useState<"shared" | CalendarType>("shared");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");

  const [memberForm, setMemberForm] = useState({ name: "", relationship: "" });

  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);
  const [entryForm, setEntryForm] = useState({
    title: "",
    date: "",
    calendarType: "work" as CalendarType,
    ownerId: "me",
    note: "",
    marked: false,
  });

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => (selectedView === "shared" ? true : entry.calendarType === selectedView))
      .filter((entry) => (selectedOwner === "all" ? true : entry.ownerId === selectedOwner))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [entries, selectedOwner, selectedView]);

  function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userName.trim()) return;

    const exists = members.some((member) => member.id === "me");
    if (!exists) {
      setMembers((prev) => [{ id: "me", name: userName.trim(), relationship: "Primary user" }, ...prev]);
    } else {
      setMembers((prev) => prev.map((member) => (member.id === "me" ? { ...member, name: userName.trim() } : member)));
    }
    setIsSignedIn(true);
  }

  function addMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memberForm.name.trim() || !memberForm.relationship.trim()) return;

    setMembers((prev) => [
      ...prev,
      {
        id: makeId(),
        name: memberForm.name.trim(),
        relationship: memberForm.relationship.trim(),
      },
    ]);
    setMemberForm({ name: "", relationship: "" });
  }

  function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!entryForm.title.trim() || !entryForm.date) return;

    setEntries((prev) => [
      ...prev,
      {
        id: makeId(),
        title: entryForm.title.trim(),
        date: entryForm.date,
        calendarType: entryForm.calendarType,
        ownerId: entryForm.ownerId,
        note: entryForm.note.trim(),
        marked: entryForm.marked,
      },
    ]);

    setEntryForm((prev) => ({ ...prev, title: "", date: "", note: "", marked: false }));
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 p-6">
        <section className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wide text-blue-300">Family Shift Planner</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-100">Sign in to your shared home dashboard</h1>
          <p className="mt-2 text-sm text-slate-300">
            Manage separate calendars for each person and combine them into one shared timeline.
          </p>
          <form onSubmit={handleSignIn} className="mt-6 flex flex-col gap-3">
            <label className="text-sm text-slate-200" htmlFor="name">Your name</label>
            <input
              id="name"
              type="text"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Jamie"
              className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none ring-blue-400 focus:ring"
            />
            <button type="submit" className="btn-primary mt-2">
              Enter dashboard
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-4 p-4">
      <header className="glass-panel rounded-xl p-4">
        <p className="text-xs uppercase tracking-wide text-blue-300">Dashboard</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-100">Welcome, {userName}</h1>
        <p className="text-sm text-slate-300">Create individual schedules and overlay them in the shared calendar view.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <form onSubmit={addMember} className="glass-panel rounded-xl p-4">
          <h2 className="text-lg font-semibold text-slate-100">Add family member / friend</h2>
          <div className="mt-3 grid gap-3">
            <input
              type="text"
              value={memberForm.name}
              onChange={(event) => setMemberForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Name"
              className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={memberForm.relationship}
              onChange={(event) => setMemberForm((prev) => ({ ...prev, relationship: event.target.value }))}
              placeholder="Relationship (Husband, Wife, Child...)"
              className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm"
            />
            <button type="submit" className="btn-secondary text-sm">Add person</button>
          </div>
        </form>

        <form onSubmit={addEntry} className="glass-panel rounded-xl p-4">
          <h2 className="text-lg font-semibold text-slate-100">Add calendar item</h2>
          <div className="mt-3 grid gap-3">
            <input
              type="text"
              value={entryForm.title}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Shift, class, party..."
              className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={entryForm.date}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, date: event.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm"
            />
            <select
              value={entryForm.calendarType}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, calendarType: event.target.value as CalendarType }))}
              className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm"
            >
              <option value="work">Work calendar</option>
              <option value="personal">Personal calendar</option>
              <option value="children">Children calendar</option>
            </select>
            <select
              value={entryForm.ownerId}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, ownerId: event.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <textarea
              value={entryForm.note}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, note: event.target.value }))}
              placeholder="Day notes"
              className="min-h-20 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={entryForm.marked}
                onChange={(event) => setEntryForm((prev) => ({ ...prev, marked: event.target.checked }))}
              />
              Mark this date
            </label>
            <button type="submit" className="btn-primary text-sm">Save event</button>
          </div>
        </form>
      </section>

      <section className="glass-panel rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedView("shared")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${selectedView === "shared" ? "bg-blue-500 text-white shadow-[0_0_18px_rgba(59,130,246,0.5)]" : "bg-slate-800/80 text-slate-200"}`}
          >
            Shared calendar
          </button>
          {Object.entries(CALENDAR_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedView(key as CalendarType)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${selectedView === key ? "bg-violet-500 text-white shadow-[0_0_18px_rgba(139,92,246,0.45)]" : "bg-slate-800/80 text-slate-200"}`}
            >
              {label}
            </button>
          ))}

          <select
            value={selectedOwner}
            onChange={(event) => setSelectedOwner(event.target.value)}
            className="ml-auto rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-xs"
          >
            <option value="all">All people</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-3">
          {filteredEntries.length === 0 ? (
            <p className="text-sm text-slate-300">No calendar entries for this filter.</p>
          ) : (
            filteredEntries.map((entry) => {
              const ownerName = members.find((member) => member.id === entry.ownerId)?.name ?? "Unknown";
              return (
                <article key={entry.id} className="rounded-lg border border-slate-700/80 bg-slate-950/70 p-3 shadow-[0_0_20px_rgba(59,130,246,0.08)]">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-slate-100">{entry.title}</h3>
                    <span className="text-xs text-slate-400">{entry.date}</span>
                  </div>
                  <p className="mt-1 text-xs text-blue-300">{CALENDAR_LABELS[entry.calendarType]} • {ownerName}</p>
                  {entry.note ? <p className="mt-2 text-sm text-slate-300">{entry.note}</p> : null}
                  {entry.marked ? <p className="mt-2 text-xs font-semibold text-teal-300">Marked date</p> : null}
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
