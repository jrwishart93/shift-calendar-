"use client";

type ViewMode = "week" | "month";

export default function ViewModeToggle({ viewMode, onChange }: { viewMode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900/80 p-0.5" role="tablist" aria-label="Calendar view mode">
      {(["week", "month"] as const).map((mode) => (
        <button
          key={mode}
          role="tab"
          aria-selected={viewMode === mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`rounded-md px-3 py-1 text-xs font-medium uppercase tracking-wide transition ${
            viewMode === mode ? "bg-slate-200 text-slate-900" : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
