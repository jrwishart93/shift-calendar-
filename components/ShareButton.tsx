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
      className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950"
    >
      Copy Public Link
    </button>
  );
}
