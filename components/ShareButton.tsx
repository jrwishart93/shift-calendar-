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
      className="min-h-[44px] rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition duration-200 hover:brightness-105 active:scale-[0.98] active:brightness-95"
    >
      🔗 Copy Public Link
    </button>
  );
}
