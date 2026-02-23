import rawShifts from "@/data/shifts-2026.json";
import { enrichShift } from "@/components/shift-utils";
import type { EnrichedShift, RawShift } from "@/components/types";

export function getAllShifts(): EnrichedShift[] {
  return (rawShifts as RawShift[]).map(enrichShift);
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}
