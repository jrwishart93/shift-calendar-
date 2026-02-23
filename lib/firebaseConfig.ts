const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "shift-calendar-jamie.firebaseapp.com",
  projectId: "shift-calendar-jamie",
  storageBucket: "shift-calendar-jamie.firebasestorage.app",
  messagingSenderId: "25685416926",
  appId: "1:25685416926:web:f7392441a42ca86c0adb4f",
  measurementId: "G-XYE101M7JN",
};

/**
 * Keep Firebase web config values in sync to avoid mixed-project settings
 * that can cause `auth/configuration-not-found` during sign-in/sign-up.
 */
export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    process.env.FIREBASE_API_KEY ??
    DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    process.env.FIREBASE_AUTH_DOMAIN ??
    DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.FIREBASE_PROJECT_ID ??
    DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    process.env.FIREBASE_STORAGE_BUCKET ??
    DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    process.env.FIREBASE_MESSAGING_SENDER_ID ??
    DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    process.env.FIREBASE_APP_ID ??
    DEFAULT_FIREBASE_CONFIG.appId,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ??
    process.env.FIREBASE_MEASUREMENT_ID ??
    DEFAULT_FIREBASE_CONFIG.measurementId,
};
