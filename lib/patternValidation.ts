import { shiftMap } from "@/data/shiftMap";

export const MIN_PATTERN_LENGTH = 6;

export type PatternValidationResult = {
  pattern: string[];
  errors: string[];
};

export function normalizePatternInput(input: string | string[]): string[] {
  if (Array.isArray(input)) {
    return input.map((code) => code.trim().toUpperCase()).filter(Boolean);
  }

  return input
    .split(",")
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
}

export function validateCorePattern(input: string | string[]): PatternValidationResult {
  const pattern = normalizePatternInput(input);
  const allowedCodes = new Set(Object.keys(shiftMap));
  const errors: string[] = [];

  if (pattern.length < MIN_PATTERN_LENGTH) {
    errors.push(`Pattern must include at least ${MIN_PATTERN_LENGTH} entries.`);
  }

  const invalidCodes = pattern.filter((code) => !allowedCodes.has(code));
  if (invalidCodes.length > 0) {
    errors.push(`Invalid shift codes: ${Array.from(new Set(invalidCodes)).join(", ")}.`);
  }

  return { pattern, errors };
}

export function isISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}
