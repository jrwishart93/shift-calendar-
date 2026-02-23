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
      className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800"
    >
      Copy Public Link
    </button>
  );
}
