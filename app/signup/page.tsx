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

      router.push("/dashboard");
    } catch {
      // Error is exposed by the hook and rendered below.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="mb-2 text-2xl font-semibold">Create account</h1>
      <p className="mb-4 text-sm text-gray-600">Sign up with email and password. Access code is optional.</p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded border border-gray-300 p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Display name (optional)</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Jamie"
          />
        </label>

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
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            placeholder="••••••••"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Access code (optional)</span>
          <input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Enter code for Jamie's shifts"
          />
          <span className="mt-1 block text-xs text-gray-500">
            Use <strong>{JAMIE_ACCESS_CODE}</strong> to load Jamie's shifts.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      {successMessage ? <p className="mt-4 text-sm text-green-700">{successMessage}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-700">{error.message}</p> : null}
      {currentUser ? <p className="mt-2 text-sm text-gray-600">Signed in as {currentUser.email}</p> : null}
    </main>
  );
}
