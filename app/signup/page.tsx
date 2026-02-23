"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { JAMIE_ACCESS_CODE } from "@/lib/signup";

export default function SignUpPage() {
  const { signUp, currentUser, error } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [bypassCode, setBypassCode] = useState("");
  const [bypassError, setBypassError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const result = await signUp(email, password, displayName, accessCode);
      const isJamieCalendar = result.selectedCalendar === "jamie";

      setSuccessMessage(
        isJamieCalendar
          ? "Sign-up successful. Jamie's shifts loaded."
          : "Sign-up successful. Your calendar is empty so you can add your own shifts.",
      );

      setDisplayName("");
      setEmail("");
      setPassword("");
      setAccessCode("");

      router.push(`/dashboard?access=${isJamieCalendar ? "jamie" : "custom"}`);
    } catch {
      // Error is exposed by the hook and rendered below.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccessBypass = () => {
    if (bypassCode.trim() !== JAMIE_ACCESS_CODE) {
      setBypassError("Invalid access code.");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("jamieAccessBypass", "true");
    }

    setBypassError(null);
    router.push("/dashboard?guest=jamie");
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Shift-Calendar</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Create account</h1>
        <p className="mt-2 text-sm text-slate-300">Create your account and start tracking shifts in seconds.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-200">Display name (optional)</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="auth-input"
              placeholder="Jamie"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-200">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="jamie@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-200">Password</span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="••••••••"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-200">Access code (optional)</span>
            <input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="auth-input"
              placeholder="Enter code for Jamie's shifts"
            />
            <span className="mt-1 block text-xs text-slate-400">
              Use <strong>{JAMIE_ACCESS_CODE}</strong> to load Jamie's shifts.
            </span>
          </label>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>

          <div className="rounded-xl border border-slate-700/80 bg-slate-900/50 p-3">
            <p className="mb-2 text-xs text-slate-300">Or skip sign-up using an access code.</p>
            <input
              value={bypassCode}
              onChange={(e) => setBypassCode(e.target.value)}
              className="auth-input"
              placeholder="Enter access code"
            />
            <button type="button" onClick={handleAccessBypass} className="btn-secondary mt-2 w-full text-sm">
              Continue with access code
            </button>
          </div>
        </form>

        {bypassError ? <p className="mt-2 text-sm text-rose-300">{bypassError}</p> : null}
        {successMessage ? <p className="mt-4 text-sm text-emerald-300">{successMessage}</p> : null}
        {error ? <p className="mt-2 text-sm text-rose-300">{error.message}</p> : null}
        {currentUser ? <p className="mt-2 text-sm text-slate-300">Signed in as {currentUser.email}</p> : null}
      </section>
    </main>
  );
}
