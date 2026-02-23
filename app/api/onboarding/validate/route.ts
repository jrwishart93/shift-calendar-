import { NextRequest, NextResponse } from "next/server";

import { isISODate, validateCorePattern } from "@/lib/patternValidation";

const JAMIE_ACCESS_CODE = process.env.JAMIE_ACCESS_CODE ?? "JAMIE2026!";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const mode = payload.mode;

  if (mode === "join") {
    const accessCode = String(payload.accessCode ?? "").trim();
    if (!accessCode || accessCode !== JAMIE_ACCESS_CODE) {
      return NextResponse.json({ message: "Invalid access code." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  }

  if (mode === "personal") {
    const patternValidation = validateCorePattern(payload.corePattern ?? []);
    if (patternValidation.errors.length > 0) {
      return NextResponse.json({ message: patternValidation.errors[0] }, { status: 400 });
    }

    const coreStartDate = String(payload.coreStartDate ?? "");
    if (!isISODate(coreStartDate)) {
      return NextResponse.json({ message: "Invalid core start date." }, { status: 400 });
    }

    return NextResponse.json({ ok: true, normalizedPattern: patternValidation.pattern });
  }

  return NextResponse.json({ message: "Unsupported onboarding mode." }, { status: 400 });
}
