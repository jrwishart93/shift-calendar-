"use client";

import { CalendarDays, LayoutList, Share2 } from "lucide-react";

export type TabId = "month" | "week" | "share";

type BottomTabBarProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

const TABS: { id: TabId; label: string; Icon: React.ComponentType<{ size?: number | string }> }[] = [
  { id: "month", label: "Calendar", Icon: CalendarDays },
  { id: "week", label: "Week", Icon: LayoutList },
  { id: "share", label: "Share", Icon: Share2 },
];

export default function BottomTabBar({ activeTab, onChange }: BottomTabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#1f3760] bg-[#000a24]/95 backdrop-blur"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={activeTab === id ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition ${
              activeTab === id ? "text-cyan-300" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Icon size={22} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
