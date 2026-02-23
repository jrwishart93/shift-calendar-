import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db, getFirebaseAuth } from "@/lib/firebase";

export const JAMIE_ACCESS_CODE = "JAMIE2026!";

export type SignUpResult = {
  uid: string;
  createdCalendarId?: string;
  selectedCalendar: "jamie" | "custom";
};

/**
 * Creates an auth user and the corresponding Firestore records.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string,
  accessCode?: string,
): Promise<SignUpResult> {
  const trimmedCode = accessCode?.trim() ?? "";
  const selectedCalendar = trimmedCode === JAMIE_ACCESS_CODE ? "jamie" : "custom";
  const normalizedDisplayName = displayName.trim() || email.split("@")[0] || "User";

  if (trimmedCode && trimmedCode !== JAMIE_ACCESS_CODE) {
    throw new Error("Invalid access code. Use JAMIE2026! for Jamie's shifts.");
  }

  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  try {
    await updateProfile(user, { displayName: normalizedDisplayName });

    await setDoc(doc(db, "users", user.uid), {
      displayName: normalizedDisplayName,
      email: user.email ?? email,
      selectedCalendar,
      accessCodeUsed: selectedCalendar === "jamie" ? JAMIE_ACCESS_CODE : null,
      createdAt: serverTimestamp(),
    });

    const calendarsRef = collection(db, "calendars");
    const existingCalendarSnapshot = await getDocs(query(calendarsRef, limit(1)));

    if (!existingCalendarSnapshot.empty) {
      return { uid: user.uid, selectedCalendar };
    }

    const calendarDoc = await addDoc(calendarsRef, {
      name: "Jamie Shift Calendar",
      ownerId: user.uid,
      timezone: "Europe/London",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "calendars", calendarDoc.id, "members", user.uid), {
      role: "admin",
      displayName: normalizedDisplayName,
      email: user.email ?? email,
      addedAt: serverTimestamp(),
    });

    return {
      uid: user.uid,
      createdCalendarId: calendarDoc.id,
      selectedCalendar,
    };
  } catch (error) {
    console.error("Failed to finish sign-up database setup:", error);
    throw error;
  }
}
