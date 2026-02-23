# Shift-Calendar

Mobile-first shift viewer built with Next.js + Tailwind.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

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
