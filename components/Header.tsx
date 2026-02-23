import Link from "next/link";

const navLinkClass =
  "flex min-h-[44px] items-center rounded-xl border border-transparent px-3 text-base font-medium text-slate-200 transition duration-200 hover:border-cyan-400/30 hover:bg-slate-800/80 active:scale-[0.98] active:bg-slate-700";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/85 pt-safe backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:py-4">
        <h1 className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
          Shift-Calendar
        </h1>
        <nav className="flex gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-1 text-base shadow-lg shadow-black/20">
          <Link href="/" className={navLinkClass}>Dashboard</Link>
          <Link href="/month" className={navLinkClass}>Month</Link>
          <Link href="/jamie" className={navLinkClass}>Public</Link>
        </nav>
      </div>
    </header>
  );
}
