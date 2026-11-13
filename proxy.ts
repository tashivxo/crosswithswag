import { NextResponse, type NextRequest } from "next/server";
import { FALLBACK_RETRY_AFTER_SECONDS, FALLBACK_STATUS } from "@/lib/fallback";

export function proxy(request: NextRequest) {
  if (FALLBACK_STATUS === 200) return NextResponse.next();
  const response = NextResponse.rewrite(new URL("/", request.url), {
    status: FALLBACK_STATUS,
  });
  response.headers.set("Retry-After", String(FALLBACK_RETRY_AFTER_SECONDS));
  return response;
}

export const config = { matcher: "/" };
