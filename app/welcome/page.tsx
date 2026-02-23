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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome to Shift-Calendar</h1>
      <p className="mt-2 text-sm text-slate-600">Join a shared calendar or create your own rota engine.</p>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode("join")}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "join" ? "bg-white shadow" : "text-slate-600"}`}
        >
          Join Jamie
        </button>
        <button
          type="button"
          onClick={() => setMode("personal")}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "personal" ? "bg-white shadow" : "text-slate-600"}`}
        >
          Create mine
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        {mode === "personal" ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Profile Name</span>
            <input
              required
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        ) : null}

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        {mode === "join" ? (
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Access Code</span>
            <input
              required
              type="password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        ) : (
          <>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Core start date</span>
              <input
                required
                type="date"
                value={coreStartDate}
                onChange={(event) => setCoreStartDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <div className="space-y-2 rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-700">Pattern mode</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPatternMode("default333")}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    patternMode === "default333" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Use 333 Pattern
                </button>
                <button
                  type="button"
                  onClick={() => setPatternMode("custom")}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    patternMode === "custom" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Create Custom Pattern
                </button>
              </div>

              {patternMode === "custom" ? (
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Pattern (comma-separated codes)</span>
                  <input
                    required
                    value={patternInput}
                    onChange={(event) => setPatternInput(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="E,E,E,L,L,L,R,R,R"
                  />
                </label>
              ) : null}

              <p className="text-xs text-slate-500">Preview: {previewPattern}</p>
            </div>
          </>
        )}

        {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "Setting up..." : mode === "join" ? "Join Jamie's calendar" : "Create my calendar"}
        </button>
      </form>
    </main>
  );
}
