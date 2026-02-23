import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#1f3760] bg-[#000a24]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <h1 className="text-2xl font-semibold leading-none text-slate-100">Shift-Calendar</h1>
        <Link href="/" className="rounded-md px-2 py-1 text-sm text-slate-400 transition hover:text-cyan-200">
          ← Home
        </Link>
      </div>
    </header>
  );
}
