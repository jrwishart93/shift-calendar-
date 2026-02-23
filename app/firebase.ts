import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "@/lib/firebaseConfig";

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export async function initFirebaseAnalytics() {
  if (typeof window === "undefined") return null;
  const supported = await isSupported();
  if (!supported) return null;

  return getAnalytics(firebaseApp);
}
