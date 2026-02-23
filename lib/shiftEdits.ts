import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import type { EnrichedShift } from "@/components/types";
import { db } from "@/lib/firebase";

export const DEFAULT_CALENDAR_ID = process.env.NEXT_PUBLIC_FIREBASE_CALENDAR_ID ?? "jamie-2026";

function shiftEditsCollectionRef(calendarId: string) {
  return collection(db, "calendars", calendarId, "shiftEdits");
}

function shiftEditDocRef(calendarId: string, date: string) {
  return doc(db, "calendars", calendarId, "shiftEdits", date);
}

export function subscribeToShiftEdits(
  onUpdate: (shiftsByDate: Record<string, EnrichedShift>) => void,
  onError?: (error: Error) => void,
  calendarId = DEFAULT_CALENDAR_ID,
): Unsubscribe {
  return onSnapshot(
    query(shiftEditsCollectionRef(calendarId)),
    (snapshot) => {
      const next: Record<string, EnrichedShift> = {};

      snapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data() as EnrichedShift;
        next[documentSnapshot.id] = {
          ...data,
          date: data.date || documentSnapshot.id,
        };
      });

      onUpdate(next);
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function saveShiftEdit(shift: EnrichedShift, calendarId = DEFAULT_CALENDAR_ID): Promise<void> {
  await setDoc(shiftEditDocRef(calendarId, shift.date), {
    ...shift,
    updatedAt: serverTimestamp(),
  });
}
