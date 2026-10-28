import type { WaitlistErrors } from "@/lib/waitlist";

export type SendWaitlistResult =
  | { status: "success" }
  | { status: "invalid"; errors: WaitlistErrors }
  | { status: "failure" };

export async function sendWaitlist(
  input: { email: string; consent: boolean },
  fetchImpl: typeof fetch = fetch,
): Promise<SendWaitlistResult> {
  try {
    const res = await fetchImpl("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email, consent: input.consent }),
    });

    const body = (await res.json()) as {
      ok?: boolean;
      errors?: WaitlistErrors;
    };

    if (res.status === 422 && body.errors) {
      return { status: "invalid", errors: body.errors };
    }
    if (res.ok && body.ok === true) return { status: "success" };
    return { status: "failure" };
  } catch {
    return { status: "failure" };
  }
}
