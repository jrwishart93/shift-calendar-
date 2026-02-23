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
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded border border-gray-300 p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            placeholder="jamie@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <Link
          href="/signup"
          className="block w-full rounded border border-black px-4 py-2 text-center text-sm font-medium text-black"
        >
          Sign up
        </Link>
      </form>

      {error ? <p className="mt-2 text-sm text-red-700">{error.message}</p> : null}

      {currentUser ? (
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p>Signed in as {currentUser.email}</p>
          <button onClick={() => void signOut()} className="rounded bg-gray-200 px-3 py-1">
            Sign out
          </button>
        </div>
      ) : null}
    </main>
  );
}
