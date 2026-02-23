import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "shift-calendar-jamie.firebaseapp.com",
  projectId: "shift-calendar-jamie",
  storageBucket: "shift-calendar-jamie.firebasestorage.app",
  messagingSenderId: "25685416926",
  appId: "1:25685416926:web:f7392441a42ca86c0adb4f",
  measurementId: "G-XYE101M7JN",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export async function initFirebaseAnalytics() {
  if (typeof window === "undefined") return null;
  const supported = await isSupported();
  if (!supported) return null;

  return getAnalytics(firebaseApp);
}
