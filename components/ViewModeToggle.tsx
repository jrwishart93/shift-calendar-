"use client";

type ViewMode = "week" | "month";

export default function ViewModeToggle({ viewMode, onChange }: { viewMode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900 p-1" role="tablist" aria-label="Calendar view mode">
      {(["week", "month"] as const).map((mode) => (
        <button
          key={mode}
          role="tab"
          aria-selected={viewMode === mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`min-h-[44px] rounded-lg px-4 text-base font-medium capitalize transition active:scale-[0.98] ${
            viewMode === mode ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-slate-800 active:bg-slate-700"
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
