# Shift-Calendar (Personal Mobile Shift Viewer)

## 1. Application Overview

Shift-Calendar is a lightweight mobile-first Progressive Web App designed to display a single user’s shift rota clearly and allow simple public sharing.

The app focuses on:
- Fast load
- Visual clarity
- Colour-coded shifts
- Offline availability
- Public read-only sharing
- Zero authentication

The primary purpose is to allow the owner to see their shifts quickly on mobile and share their upcoming availability with others via a single link.

## 2. Target Platform
- Mobile browsers (Safari / Chrome)
- Installable PWA
- Desktop support secondary

## 3. Technology Stack

Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Data:
- Static JSON files stored locally in `/data`

Deployment:
- Vercel

## 4. Folder Structure

```text
shift-calendar/
  app/
  components/
  data/
  public/
  styles/
  BRIEFING.md
```

## 5. Core Data File

Primary shift file:

`/data/shifts-2026.json`

## 6. Shift Data Schema

Each shift entry must contain:

```json
{
  "date": "2026-03-20",
  "weekday": "Friday",
  "code": "N",
  "label": "Night Shift",
  "type": "night",
  "colour": "#7C3AED",
  "startTime": "22:00",
  "endTime": "07:00",
  "hours": 9,
  "location": "RPU Edinburgh",
  "note": "",
  "isWeekend": false,
  "isPublicHoliday": false
}
```

### Field Definitions

| Field | Description |
|---|---|
| date | ISO date |
| weekday | Human readable |
| code | Rota code (E, L, N, R, AL etc) |
| label | Full shift name |
| type | early / late / night / rest / leave / admin |
| colour | Hex colour |
| startTime | Optional |
| endTime | Optional |
| hours | Optional |
| location | Optional |
| note | Optional |
| isWeekend | Boolean |
| isPublicHoliday | Boolean |

## 7. Supported Shift Types

Working:
- early
- day
- late
- night
- varied

Non-working:
- rest
- annual_leave
- toil
- public_holiday

Admin:
- court
- course
- operation
- overtime

## 8. Colour Mapping

- early/day: `#22C55E`
- late: `#F59E0B`
- night: `#7C3AED`
- rest: `#38BDF8`
- annual_leave: `#14B8A6`
- court: `#EF4444`
- course: `#FB923C`
- toil: `#0EA5E9`

## 9. Pages

### `/`

Dashboard:
- Today highlighted
- Next 7 days
- Swipeable weeks

### `/month`

Monthly calendar:
- Colour grid
- Tap day → modal

### `/jamie`

Public read-only:
- Next 14 days
- Month view

No edit controls.

## 10. Components

- `WeekView.tsx`
- `MonthGrid.tsx`
- `DayCard.tsx`
- `DayModal.tsx`
- `Header.tsx`
- `ShareButton.tsx`

## 11. UI Requirements
- Dark mode default
- Large tap targets
- Rounded cards
- Minimal text
- Colour communicates shift

## 12. Progressive Web App

Required:
- `manifest.json`
- service worker
- offline caching
- app icon

App name:

**Shift-Calendar**

## 13. Behaviour Rules
- Auto-scroll to today
- Swipe left/right to change week
- Tap month to open month grid
- Tap day opens modal
- Share button copies public link

## 14. Public Sharing

Route:

`/jamie`

Loads same JSON.

Displays:
- Upcoming shifts
- Month view

Read-only.

## 15. Optional Metadata (future)

Reserved fields:
- `payRate`
- `nightAllowance`
- `weekendBonus`
- `fatigueScore`

Not implemented v1.

## 16. Success Criteria
- Works offline
- Installable on iPhone
- Shift visible within 2 seconds
- Family can view without login
- JSON edits instantly reflected

## 17. Explicit Non-Goals
- No authentication
- No editing UI
- No multi-user
- No backend

## 18. Versioning

**v1.0**  
Single-user personal shift viewer.
