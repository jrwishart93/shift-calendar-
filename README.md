# Shift-Calendar

Mobile-first shift viewer built with Next.js + Tailwind.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Image folders

- `public/images/` for general public images you want to serve from the app.
- `app/images/` for app-level images, including your web app icon source file.

## Data files

- `data/shiftMap.ts` maps rota codes to labels/types/times.
- `data/shifts-2026.json` stores daily shift records for 2026.

## Seed Firebase

```bash
npx ts-node scripts/seedShifts.ts
```

Set these env vars first:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

For the Next.js app, each `FIREBASE_*` variable is mapped to the equivalent `NEXT_PUBLIC_FIREBASE_*` variable in `next.config.js`, so Vercel can be configured with either naming scheme.

## Persist admin edits to Firestore

The dashboard now saves shift edits to:

`calendars/{NEXT_PUBLIC_FIREBASE_CALENDAR_ID}/shiftEdits/{YYYY-MM-DD}`

Add this environment variable to your `.env.local`:

- `NEXT_PUBLIC_FIREBASE_CALENDAR_ID` (example: `jamie-2026`)

Recommended Firestore rules for this collection (admin write, signed-in read):

```txt
match /calendars/{calendarId}/shiftEdits/{date} {
  allow read: if request.auth != null;
  allow write: if request.auth != null
    && exists(/databases/$(database)/documents/calendars/$(calendarId)/members/$(request.auth.uid))
    && get(/databases/$(database)/documents/calendars/$(calendarId)/members/$(request.auth.uid)).data.role == "admin";
}
```
