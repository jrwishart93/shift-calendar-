"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collectionGroup, doc, documentId, getDoc, getDocs, limit, query, where } from "firebase/firestore";

import DashboardViews from "@/components/DashboardViews";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { getAllShifts, getToday } from "@/app/lib";

type CalendarContext = {
  calendarId: string;
  calendarName: string;
  hasCorePattern: boolean;
};

async function getFirstCalendarForUser(uid: string): Promise<CalendarContext | null> {
  const membershipSnapshot = await getDocs(
    query(collectionGroup(db, "members"), where(documentId(), "==", uid), limit(1)),
  );

  if (membershipSnapshot.empty) {
    return null;
  }

  const memberDoc = membershipSnapshot.docs[0];
  const calendarRef = memberDoc.ref.parent.parent;
  if (!calendarRef) {
    return null;
  }

  const calendarSnapshot = await getDoc(doc(db, "calendars", calendarRef.id));
  const calendarData = calendarSnapshot.data() as { name?: string; corePattern?: string[] } | undefined;

  return {
    calendarId: calendarRef.id,
    calendarName: calendarData?.name ?? "Your Shift Calendar",
    hasCorePattern: Array.isArray(calendarData?.corePattern) && (calendarData?.corePattern?.length ?? 0) > 0,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [calendarContext, setCalendarContext] = useState<CalendarContext | null>(null);
  const [isResolving, setIsResolving] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!currentUser) {
      router.replace("/welcome");
      return;
    }

    const uid = currentUser.uid;

    async function resolveMembership() {
      setIsResolving(true);
      setError(null);

      try {
        const context = await getFirstCalendarForUser(uid);
        if (!context) {
          setError("No calendar membership found yet. Please contact an admin.");
          return;
        }

        setCalendarContext(context);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Could not load calendar context.");
      } finally {
        setIsResolving(false);
      }
    }

    void resolveMembership();
  }, [currentUser, loading, router]);

  if (loading || isResolving) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading dashboard...</main>;
  }

  if (error || !calendarContext) {
    return <main className="flex min-h-screen items-center justify-center px-6 text-sm text-red-700">{error ?? "Missing calendar context."}</main>;
  }

  return (
    <DashboardViews
      shifts={getAllShifts()}
      today={getToday()}
      useCorePattern={calendarContext.hasCorePattern}
      calendarName={calendarContext.calendarName}
    />
  );
}
