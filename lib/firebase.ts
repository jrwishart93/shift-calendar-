import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "@/lib/firebaseConfig";

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

let cachedAuth: Auth | null = null;

/**
 * Auth is only needed on the client for this flow.
 * Lazily creating it avoids build-time prerender failures in environments
 * where Firebase client env vars are not present.
 */
export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser.");
  }

  if (!cachedAuth) {
    cachedAuth = getAuth(app);
  }

  return cachedAuth;
}
