"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export default function SignUpPage() {
  const { signUp, currentUser, error } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const result = await signUp(email, password, displayName);
      const calendarMessage = result.createdCalendarId
        ? `First calendar created (${result.createdCalendarId}).`
        : "User created. Waiting for invite to a calendar.";

      setSuccessMessage(`Sign-up successful. ${calendarMessage}`);
      setDisplayName("");
      setEmail("");
      setPassword("");
    } catch {
      // Error is exposed by the hook and rendered below.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create account</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded border border-gray-300 p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Display name</span>
          <input
            required
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
