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
  where,
} from "firebase/firestore";

import { CORE_PATTERN } from "@/lib/corePattern";
import { db, getFirebaseAuth } from "@/lib/firebase";
import { isISODate, validateCorePattern } from "@/lib/patternValidation";

const DEFAULT_TIMEZONE = "Europe/London";

export type OnboardUserInput = {
  email: string;
  password: string;
  profileName: string;
  accessCode?: string;
  corePattern?: string[];
  coreStartDate?: string;
};

export type OnboardUserResult = {
  calendarId: string;
  role: "viewer" | "admin";
  mode: "jamie" | "personal";
};

async function findJamieCalendarId(): Promise<string> {
  const calendarsRef = collection(db, "calendars");

  const flaggedQuery = await getDocs(query(calendarsRef, where("isJamieShared", "==", true), limit(1)));
  if (!flaggedQuery.empty) {
    return flaggedQuery.docs[0].id;
  }

  const nameQuery = await getDocs(query(calendarsRef, where("name", "==", "Jamie Shift Calendar"), limit(1)));
  if (!nameQuery.empty) {
    return nameQuery.docs[0].id;
  }

  const fallbackQuery = await getDocs(query(calendarsRef, limit(25)));
  const fallbackDoc = fallbackQuery.docs.find((calendarDoc) => {
    const name = String(calendarDoc.data().name ?? "").toLowerCase();
    return name.includes("jamie");
  });

  if (fallbackDoc) {
    return fallbackDoc.id;
  }

  throw new Error("Jamie calendar is not configured yet. Please contact an admin.");
}

export async function onboardUser({
  email,
  password,
  profileName,
  accessCode,
  corePattern,
  coreStartDate,
}: OnboardUserInput): Promise<OnboardUserResult> {
  const auth = getFirebaseAuth();
  const normalizedProfileName = profileName.trim() || email.split("@")[0] || "User";

  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: normalizedProfileName });

  const trimmedCode = accessCode?.trim();

  if (trimmedCode) {
    const jamieCalendarId = await findJamieCalendarId();

    await setDoc(doc(db, "calendars", jamieCalendarId, "members", user.uid), {
      uid: user.uid,
      role: "viewer",
      displayName: normalizedProfileName,
      email,
      addedAt: serverTimestamp(),
      joinedVia: "access_code",
    }, { merge: true });

    await setDoc(doc(db, "users", user.uid), {
      displayName: normalizedProfileName,
      email,
      defaultCalendarId: jamieCalendarId,
      selectedCalendar: "jamie",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return {
      calendarId: jamieCalendarId,
      role: "viewer",
      mode: "jamie",
    };
  }

  const resolvedPattern = corePattern && corePattern.length > 0 ? corePattern : [...CORE_PATTERN];

  const { pattern, errors } = validateCorePattern(resolvedPattern);
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  if (!coreStartDate || !isISODate(coreStartDate)) {
    throw new Error("A valid core start date is required.");
  }

  const calendarDoc = await addDoc(collection(db, "calendars"), {
    ownerId: user.uid,
    name: `${normalizedProfileName}'s Calendar`,
    corePattern: pattern,
    coreStartDate,
    timezone: DEFAULT_TIMEZONE,
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(db, "calendars", calendarDoc.id, "members", user.uid), {
    uid: user.uid,
    role: "admin",
    displayName: normalizedProfileName,
    email,
    addedAt: serverTimestamp(),
  });

  await setDoc(doc(db, "users", user.uid), {
    displayName: normalizedProfileName,
    email,
    defaultCalendarId: calendarDoc.id,
    selectedCalendar: "custom",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return {
    calendarId: calendarDoc.id,
    role: "admin",
    mode: "personal",
  };
}
