"use client";

import { useEffect, useState } from "react";
import type { EnrichedShift } from "./types";

type ShiftDetailModalProps = {
  date: string;
  shift: EnrichedShift | null;
  isAdmin: boolean;
  onClose: () => void;
  onSave?: (updated: EnrichedShift) => Promise<void> | void;
};

const shiftTypeOptions = [
  "early",
  "late",
  "night",
  "rest",
  "annual_leave",
  "court",
  "course",
  "service_break"
] as const;

export default function ShiftDetailModal({ date, shift, isAdmin, onClose, onSave }: ShiftDetailModalProps) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: shift?.type ?? "rest",
    startTime: shift?.startTime ?? "",
    endTime: shift?.endTime ?? "",
    note: shift?.note ?? ""
  });

  useEffect(() => {
    setForm({
      type: shift?.type ?? "rest",
      startTime: shift?.startTime ?? "",
      endTime: shift?.endTime ?? "",
      note: shift?.note ?? ""
    });
  }, [shift]);

  return (
    <dialog open className="fixed inset-0 z-20 m-0 flex h-full w-full items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100">
        <p className="text-xs uppercase tracking-wide text-slate-400">{isAdmin ? "Edit mode" : "Read only"}</p>
        <h3 className="mt-1 text-lg font-semibold">{date}</h3>

        {shift ? (
          <>
            <p className="mt-2 text-sm text-slate-300">{shift.label}</p>
            {!isAdmin ? (
              <>
                <p className="mt-2 text-sm">{shift.startTime && shift.endTime ? `${shift.startTime}–${shift.endTime}` : "No hours"}</p>
                <p className="mt-2 text-sm text-slate-400">{shift.note || "No note"}</p>
                <p className="mt-3 text-xs text-cyan-300">Sign in from the dashboard header to edit this shift.</p>
              </>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-300">Shift type</span>
                  <select
                    value={form.type}
                    onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                  >
                    {shiftTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-sm">
                    <span className="mb-1 block text-slate-300">Start</span>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-slate-300">End</span>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                    />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-300">Note</span>
                  <textarea
                    value={form.note}
                    onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                    className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                  />
                </label>
              </div>
            )}
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-300">No shift assigned.</p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800">
            Close
          </button>
          {isAdmin && shift ? (
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                setSaveError(null);

                try {
                  await onSave?.({ ...shift, ...form, note: form.note });
                  onClose();
                } catch (error) {
                  setSaveError(error instanceof Error ? error.message : "Failed to save shift.");
                } finally {
                  setSaving(false);
                }
              }}
              className="rounded-lg bg-sky-400 px-3 py-1.5 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          ) : null}
        </div>
        {saveError ? <p className="mt-2 text-xs text-rose-300">{saveError}</p> : null}
      </div>
    </dialog>
  );
}
