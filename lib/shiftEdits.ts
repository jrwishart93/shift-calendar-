import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";

import type { EnrichedShift } from "@/components/types";
import { db } from "@/lib/firebase";

const DEFAULT_CALENDAR_ID = process.env.NEXT_PUBLIC_FIREBASE_CALENDAR_ID ?? "jamie-2026";

function shiftEditDocRef(date: string) {
  return doc(db, "calendars", DEFAULT_CALENDAR_ID, "shiftEdits", date);
}

export function subscribeToShiftEdit(
  date: string,
  onUpdate: (shift: EnrichedShift | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    shiftEditDocRef(date),
    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate(null);
        return;
      }

      onUpdate(snapshot.data() as EnrichedShift);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export async function saveShiftEdit(shift: EnrichedShift): Promise<void> {
  await setDoc(shiftEditDocRef(shift.date), {
    ...shift,
    updatedAt: serverTimestamp(),
  });
}

