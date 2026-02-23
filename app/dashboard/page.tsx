"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

import DashboardViews from "@/components/DashboardViews";
import { getAllShifts, getToday } from "@/app/lib";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";

type CalendarAccess = "jamie" | "custom";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarAccess | null>(null);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace("/login?next=/dashboard");
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    async function loadUserCalendarPreference() {
      if (!currentUser) {
        setSelectedCalendar(null);
        return;
      }

      try {
        const userSnapshot = await getDoc(doc(db, "users", currentUser.uid));
        const calendar = userSnapshot.data()?.selectedCalendar;
        setSelectedCalendar(calendar === "jamie" ? "jamie" : "custom");
      } catch (error) {
        console.error("Failed to load selected calendar:", error);
        setSelectedCalendar("custom");
      }
    }

    void loadUserCalendarPreference();
  }, [currentUser]);

  if (loading || !currentUser || !selectedCalendar) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050b1f] px-4 text-slate-200">
        <p className="text-sm">Loading your shift calendar...</p>
      </main>
    );
  }

  const isJamieCalendar = selectedCalendar === "jamie";

  return (
    <DashboardViews
      shifts={isJamieCalendar ? getAllShifts() : []}
      today={getToday()}
      useCorePattern={isJamieCalendar}
      calendarName={isJamieCalendar ? "Jamie's 2026 Shifts" : "Your Shift Calendar"}
    />
  );
}
