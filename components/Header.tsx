import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
        <h1 className="text-lg font-bold">Shift-Calendar</h1>
        <nav className="flex gap-3 text-sm">
          <Link href="/" className="rounded px-2 py-1 hover:bg-slate-800">Dashboard</Link>
          <Link href="/month" className="rounded px-2 py-1 hover:bg-slate-800">Month</Link>
          <Link href="/jamie" className="rounded px-2 py-1 hover:bg-slate-800">Public</Link>
        </nav>
      </div>
    </header>
  );
}
