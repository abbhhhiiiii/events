import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function fail(error: unknown, status = 500) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "VALIDATION_ERROR", details: error.flatten() }, { status: 400 });
  }

  const message = error instanceof Error ? error.message : "SERVER_ERROR";
  return NextResponse.json({ error: message }, { status });
}
