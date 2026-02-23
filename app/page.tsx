"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    router.replace(currentUser ? "/dashboard" : "/welcome");
  }, [currentUser, loading, router]);

  return <main className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading Shift-Calendar...</main>;
}
