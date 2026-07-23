import { NextResponse } from "next/server";
import { ZodError } from "zod";

const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_ADMIN_URL,
].filter((origin): origin is string => Boolean(origin));

export function getCorsHeaders(request?: Request) {
  const origin = request?.headers.get("origin");
  const allowedOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0] ?? "null";

  return {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Razorpay-Signature",
  "Vary": "Origin",
  };
}

export const corsHeaders = getCorsHeaders();

export function ok<T>(data: T, status = 200, request?: Request) {
  return NextResponse.json(
    { data },
    {
      status,
      headers: getCorsHeaders(request),
    }
  );
}

export function fail(error: unknown, status = 500, request?: Request) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        details: error.flatten(),
      },
      {
        status: 400,
        headers: getCorsHeaders(request),
      }
    );
  }

  const message =
    error instanceof Error ? error.message : "SERVER_ERROR";

  return NextResponse.json(
    {
      error: message,
    },
    {
      status,
      headers: getCorsHeaders(request),
    }
  );
}

export function options(request?: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}
