"use client";

import { Share2 } from "lucide-react";

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
      className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <Share2 size={17} strokeWidth={2} aria-hidden="true" />
      Copy Public Link
    </button>
  );
}
