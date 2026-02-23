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

export type SignUpResult = {
  uid: string;
  createdCalendarId?: string;
};

/**
 * Creates an auth user and the corresponding Firestore records.
 *
 * Flow:
 * 1) Create Firebase Auth user (email + password)
 * 2) Create /users/{uid} profile
 * 3) If no calendar exists yet, create first calendar + admin membership
 */
export async function signUp(email: string, password: string, displayName: string): Promise<SignUpResult> {
  const normalizedDisplayName = displayName.trim();

  if (!normalizedDisplayName) {
    throw new Error("Display name is required.");
  }

  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  try {
    await updateProfile(user, { displayName: normalizedDisplayName });

    await setDoc(doc(db, "users", user.uid), {
      displayName: normalizedDisplayName,
      email: user.email ?? email,
      createdAt: serverTimestamp(),
    });

    const calendarsRef = collection(db, "calendars");
    const existingCalendarSnapshot = await getDocs(query(calendarsRef, limit(1)));

    if (!existingCalendarSnapshot.empty) {
      console.log("Sign up complete. Calendar already exists, waiting for invite.");
      return { uid: user.uid };
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

    console.log("Sign up complete. First calendar created with admin membership.");

    return {
      uid: user.uid,
      createdCalendarId: calendarDoc.id,
    };
  } catch (error) {
    // Bubble up errors so UI can show proper feedback.
    console.error("Failed to finish sign-up database setup:", error);
    throw error;
  }
}
