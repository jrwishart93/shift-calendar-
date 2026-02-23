import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import shifts from "../data/shifts-2026.json";
import { shiftMap } from "../data/shiftMap";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// CHANGE THIS:
const CALENDAR_ID = "YOUR_CALENDAR_ID";

async function seed() {
  for (const day of shifts as any[]) {
    const map = shiftMap[day.code];

    await addDoc(collection(db, `calendars/${CALENDAR_ID}/shifts`), {
      date: day.date,
      code: day.code,
      type: map?.type ?? "unknown",
      label: map?.label ?? day.code,
      startTime: map?.start ?? null,
      endTime: map?.end ?? null,
      note: day.note ?? "",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("Seeded", day.date);
  }
}

seed();
