import { enrichShift } from "@/components/shift-utils";
import type { EnrichedShift } from "@/components/types";
import { getOverrideByDate, type ShiftOverride } from "@/lib/shiftOverrides";
import { getCoreShift } from "@/utils/getCoreShift";

const overrideCache = new Map<string, ShiftOverride | null>();

async function getCachedOverride(date: string): Promise<ShiftOverride | null> {
  if (overrideCache.has(date)) {
    return overrideCache.get(date) ?? null;
  }

  const override = await getOverrideByDate(date);
  overrideCache.set(date, override);
  return override;
}

export function updateResolveShiftOverrideCache(overridesByDate: Record<string, ShiftOverride>) {
  Object.entries(overridesByDate).forEach(([date, override]) => {
    overrideCache.set(date, override);
  });
}

export async function resolveShift(date: string, firestoreShift?: EnrichedShift): Promise<EnrichedShift> {
  if (firestoreShift) {
    console.log("[resolveShift] using firestore shift", { date, code: firestoreShift.code });
    return firestoreShift;
  }

  const override = await getCachedOverride(date);
  if (override) {
    console.log("[resolveShift] using override", { date, code: override.code });
    return enrichShift({ date, code: override.code, note: override.note });
  }

  const coreCode = getCoreShift(date);
  console.log("[resolveShift] using core pattern", { date, code: coreCode });
  return enrichShift({ date, code: coreCode });
}
