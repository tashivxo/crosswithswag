import type { JotformConfig } from "@/lib/jotform";
import { validateWaitlist, type WaitlistValue } from "@/lib/waitlist";

export type WaitlistDeps = {
  config: JotformConfig | null;
  submit: (value: WaitlistValue, config: JotformConfig) => Promise<void>;
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function handleWaitlist(
  request: Request,
  deps: WaitlistDeps,
): Promise<Response> {
  let payload: { email?: unknown; consent?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const result = validateWaitlist({
    email: payload?.email,
    consent: payload?.consent,
  });
  if (!result.ok) return json({ ok: false, errors: result.errors }, 422);

  if (!deps.config) return json({ ok: false, error: "unavailable" }, 503);

  try {
    await deps.submit(result.value, deps.config);
  } catch {
    return json({ ok: false, error: "unavailable" }, 502);
  }

  return json({ ok: true }, 200);
}
