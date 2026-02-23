"use client";

type ViewMode = "week" | "month";

export default function ViewModeToggle({ viewMode, onChange }: { viewMode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div
      className="inline-flex rounded-2xl border border-white/10 bg-slate-900/80 p-1 shadow-lg shadow-black/30"
      role="tablist"
      aria-label="Calendar view mode"
    >
      {(["week", "month"] as const).map((mode) => (
        <button
          key={mode}
          role="tab"
          aria-selected={viewMode === mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`min-h-[44px] rounded-xl px-4 text-base font-semibold capitalize transition duration-200 active:scale-[0.98] ${
            viewMode === mode
              ? "bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 shadow-md"
              : "text-slate-200 hover:bg-slate-800/80 active:bg-slate-700"
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
