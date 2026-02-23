import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export const CORE_PATTERN_KEY = "333-rota";
export const CORE_START_DATE = "2026-01-31";

export const CORE_PATTERN = [
  "E", "E", "E",
  "L", "L", "L",
  "R", "R", "R",
  "E", "E", "E",
  "L", "L", "L",
  "R", "R", "R",
  "E", "E", "E",
  "N", "N", "N",
  "R", "R", "R",
] as const;

export type StoredCorePattern = {
  name: string;
  anchorDate: string;
  cycleLength: number;
  pattern: string[];
};

function corePatternDocRef() {
  return doc(db, "corePatterns", CORE_PATTERN_KEY);
}

export async function saveCorePatternToBackend(): Promise<void> {
  const payload: StoredCorePattern = {
    name: "333 rota",
    anchorDate: CORE_START_DATE,
    cycleLength: CORE_PATTERN.length,
    pattern: [...CORE_PATTERN],
  };

  console.log("[saveCorePatternToBackend] writing", payload);

  await setDoc(corePatternDocRef(), {
    ...payload,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getCorePatternFromBackend(): Promise<StoredCorePattern | null> {
  const snapshot = await getDoc(corePatternDocRef());
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Partial<StoredCorePattern>;
  if (!data.pattern || !data.anchorDate || !data.name) {
    return null;
  }

  return {
    name: data.name,
    anchorDate: data.anchorDate,
    cycleLength: data.cycleLength ?? data.pattern.length,
    pattern: data.pattern,
  };
}
