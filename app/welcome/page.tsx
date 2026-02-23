"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { CORE_PATTERN } from "@/lib/corePattern";
import { onboardUser } from "@/lib/onboardUser";
import { normalizePatternInput } from "@/lib/patternValidation";

type Mode = "join" | "personal";
type PatternMode = "default333" | "custom";

export default function WelcomePage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  const [mode, setMode] = useState<Mode>("join");
  const [patternMode, setPatternMode] = useState<PatternMode>("default333");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileName, setProfileName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [coreStartDate, setCoreStartDate] = useState("");
  const [patternInput, setPatternInput] = useState("E,E,E,L,L,L,R,R,R");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, loading, router]);

  const previewPattern = useMemo(() => {
    if (patternMode === "default333") {
      return CORE_PATTERN.join(", ");
    }

    return normalizePatternInput(patternInput).join(", ");
  }, [patternInput, patternMode]);

  async function validateOnServer(nextMode: Mode, nextPattern: string[]) {
    const response = await fetch("/api/onboarding/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: nextMode,
        accessCode,
        corePattern: nextPattern,
        coreStartDate,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      throw new Error(data.message ?? "Validation failed.");
    }

    return response.json().catch(() => ({}));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "join") {
        await validateOnServer("join", []);

        await onboardUser({
          email,
          password,
          profileName: profileName || email,
          accessCode,
        });
      } else {
        const resolvedPattern = patternMode === "default333" ? [...CORE_PATTERN] : normalizePatternInput(patternInput);
        await validateOnServer("personal", resolvedPattern);

        await onboardUser({
          email,
          password,
          profileName,
          corePattern: resolvedPattern,
          coreStartDate,
        });
      }

      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Onboarding failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Shift-Calendar</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Get started</h1>
        <p className="mt-2 text-sm text-slate-300">Join a shared calendar or launch your own rota engine.</p>

        <div className="auth-segment mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("join")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "join" ? "auth-segment-active text-slate-100" : "text-slate-300"
            }`}
          >
            Join Jamie
          </button>
          <button
            type="button"
            onClick={() => setMode("personal")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "personal" ? "auth-segment-active text-slate-100" : "text-slate-300"
            }`}
          >
            Create mine
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-200">Email</span>
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="auth-input" />
          </label>

          {mode === "personal" ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-200">Profile Name</span>
              <input required value={profileName} onChange={(event) => setProfileName(event.target.value)} className="auth-input" />
            </label>
          ) : null}

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-200">Password</span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="auth-input"
            />
          </label>

          {mode === "join" ? (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-200">Access Code</span>
              <input
                required
                type="password"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                className="auth-input"
              />
            </label>
          ) : (
            <>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-200">Core start date</span>
                <input
                  required
                  type="date"
                  value={coreStartDate}
                  onChange={(event) => setCoreStartDate(event.target.value)}
                  className="auth-input"
                />
              </label>

              <div className="space-y-2 rounded-xl border border-slate-500/40 bg-slate-900/20 p-3">
                <p className="text-sm font-medium text-slate-200">Pattern mode</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPatternMode("default333")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      patternMode === "default333" ? "auth-segment-active text-slate-100" : "bg-slate-900/40 text-slate-300"
                    }`}
                  >
                    Use 333 Pattern
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatternMode("custom")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      patternMode === "custom" ? "auth-segment-active text-slate-100" : "bg-slate-900/40 text-slate-300"
                    }`}
                  >
                    Create Custom Pattern
                  </button>
                </div>

                {patternMode === "custom" ? (
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-200">Pattern (comma-separated codes)</span>
                    <input
                      required
                      value={patternInput}
                      onChange={(event) => setPatternInput(event.target.value)}
                      className="auth-input"
                      placeholder="E,E,E,L,L,L,R,R,R"
                    />
                  </label>
                ) : null}

                <p className="text-xs text-slate-400">Preview: {previewPattern}</p>
              </div>
            </>
          )}

          {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? "Setting up..." : mode === "join" ? "Join Jamie's calendar" : "Create my calendar"}
          </button>
        </form>
      </section>
    </main>
  );
}
