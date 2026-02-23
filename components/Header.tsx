import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-blue-900/40 bg-[#070d1f]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
        <h1 className="text-lg font-bold text-slate-100">Shift-Calendar</h1>
        <nav className="flex gap-3 text-sm">
          <Link href="/" className="rounded px-2 py-1 text-slate-200 transition hover:text-blue-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]">Dashboard</Link>
          <Link href="/month" className="rounded px-2 py-1 text-slate-200 transition hover:text-blue-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]">Month</Link>
          <Link href="/jamie" className="rounded px-2 py-1 text-slate-200 transition hover:text-violet-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">Public</Link>
        </nav>
      </div>
    </header>
  );
}
