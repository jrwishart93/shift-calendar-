"use client";

type ViewMode = "week" | "month";

export default function ViewModeToggle({ viewMode, onChange }: { viewMode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="inline-flex w-full max-w-xs rounded-2xl bg-[#0b1838] p-1" role="tablist" aria-label="Calendar view mode">
      {([
        ["week", "Week"],
        ["month", "Month"]
      ] as const).map(([mode, label]) => (
        <button
          key={mode}
          role="tab"
          aria-selected={viewMode === mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`flex-1 rounded-xl px-4 py-2 text-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
            viewMode === mode ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-[#12224a]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
