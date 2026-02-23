import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type ShiftOverride = {
  code: string;
  note?: string;
};

function overridesCollectionRef() {
  return collection(db, "overrides");
}

function overrideDocRef(date: string) {
  return doc(db, "overrides", date);
}

export async function getOverrideByDate(date: string): Promise<ShiftOverride | null> {
  const snapshot = await getDoc(overrideDocRef(date));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as ShiftOverride;
  return {
    code: data.code,
    note: data.note,
  };
}

export function subscribeToOverrides(
  onUpdate: (overridesByDate: Record<string, ShiftOverride>) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(overridesCollectionRef()),
    (snapshot) => {
      const next: Record<string, ShiftOverride> = {};

      snapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data() as ShiftOverride;
        next[documentSnapshot.id] = {
          code: data.code,
          note: data.note,
        };
      });

      onUpdate(next);
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function saveOverride(date: string, override: ShiftOverride): Promise<void> {
  console.log("[saveOverride] writing override", { date, override });
  await setDoc(overrideDocRef(date), {
    ...override,
    updatedAt: serverTimestamp(),
  });
}
