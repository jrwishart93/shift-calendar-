"use client";

export default function ShareButton() {
  async function handleShare() {
    const url = `${window.location.origin}/jamie`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Public link copied.");
    } catch {
      prompt("Copy this public link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full rounded-xl border border-cyan-500/45 bg-cyan-500 px-4 py-2.5 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400"
    >
      Copy Public Link
    </button>
  );
}
