"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { signIn, error, currentUser, signOut } = useAuth();
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = new URLSearchParams(window.location.search).get("next");
    if (next) {
      setNextPath(next);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      router.replace(nextPath);
    }
  }, [currentUser, nextPath, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch {
      // Hook surfaces error.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Shift-Calendar</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-300">Sign in to check your rota and keep your team synced.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <Link
          href="/signup"
            className="btn-secondary block w-full text-center text-sm"
        >
          Sign up
        </Link>
      </form>

        {error ? <p className="mt-3 text-sm text-rose-300">{error.message}</p> : null}

        {currentUser ? (
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>Signed in as {currentUser.email}</p>
            <button onClick={() => void signOut()} className="btn-secondary px-3 py-1 text-xs">
              Sign out
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
