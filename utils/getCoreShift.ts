import { CORE_PATTERN, CORE_START_DATE } from "@/lib/corePattern";

const patternLength = CORE_PATTERN.length;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function getCoreShift(dateISO: string): string {
  const anchorTime = new Date(`${CORE_START_DATE}T00:00:00Z`).getTime();
  const dateTime = new Date(`${dateISO}T00:00:00Z`).getTime();

  const diffDays = Math.floor((dateTime - anchorTime) / millisecondsPerDay);
  const index = ((diffDays % patternLength) + patternLength) % patternLength;

  const code = CORE_PATTERN[index];
  console.log("[getCoreShift] resolved", { dateISO, diffDays, index, code });
  return code;
}
