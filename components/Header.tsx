import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 pt-safe backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:py-4">
        <h1 className="text-lg font-bold">Shift-Calendar</h1>
        <nav className="flex gap-2 text-base">
          <Link href="/" className="flex min-h-[44px] items-center rounded px-3 transition active:scale-[0.98] hover:bg-slate-800 active:bg-slate-700">Dashboard</Link>
          <Link href="/month" className="flex min-h-[44px] items-center rounded px-3 transition active:scale-[0.98] hover:bg-slate-800 active:bg-slate-700">Month</Link>
          <Link href="/jamie" className="flex min-h-[44px] items-center rounded px-3 transition active:scale-[0.98] hover:bg-slate-800 active:bg-slate-700">Public</Link>
        </nav>
      </div>
    </header>
  );
}
