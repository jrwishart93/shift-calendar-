const corePattern = [
  "E", "E", "E",
  "L", "L", "L",
  "R", "R", "R",
  "E", "E", "E",
  "L", "L", "L",
  "R", "R", "R",
  "E", "E", "E",
  "N", "N", "N",
  "R", "R", "R",
] as const;

const coreStartDate = "2026-01-31";
const patternLength = corePattern.length;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function getCoreShift(date: string): string {
  const anchorTime = new Date(`${coreStartDate}T00:00:00Z`).getTime();
  const dateTime = new Date(`${date}T00:00:00Z`).getTime();

  const diffDays = Math.floor((dateTime - anchorTime) / millisecondsPerDay);
  const index = ((diffDays % patternLength) + patternLength) % patternLength;

  const code = corePattern[index];
  console.log("[getCoreShift]", { date, diffDays, index, code });
  return code;
}
