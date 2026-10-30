import type { WaitlistValue } from "@/lib/waitlist";

export type JotformConfig = {
  apiKey: string;
  formId: string;
  emailQid: string;
  consentQid: string;
  consentValue: string;
  apiBase: string;
};

export class JotformError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "JotformError";
  }
}

type Env = Record<string, string | undefined>;

export function readJotformConfig(env: Env): JotformConfig | null {
  const apiKey = env.JOTFORM_API_KEY?.trim();
  const formId = env.JOTFORM_FORM_ID?.trim();
  const emailQid = env.JOTFORM_EMAIL_QID?.trim();
  const consentQid = env.JOTFORM_CONSENT_QID?.trim();

  if (!apiKey || !formId || !emailQid || !consentQid) return null;

  return {
    apiKey,
    formId,
    emailQid,
    consentQid,
    consentValue: env.JOTFORM_CONSENT_VALUE?.trim() || "Yes",
    apiBase: (env.JOTFORM_API_BASE?.trim() || "https://api.jotform.com").replace(
      /\/+$/,
      "",
    ),
  };
}

export async function submitToJotform(
  value: WaitlistValue,
  config: JotformConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const body = new URLSearchParams();
  body.set(`submission[${config.emailQid}]`, value.email);
  body.set(`submission[${config.consentQid}][0]`, config.consentValue);

  let response: Response;
  try {
    response = await fetchImpl(
      `${config.apiBase}/form/${encodeURIComponent(config.formId)}/submissions`,
      {
        method: "POST",
        headers: {
          APIKEY: config.apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        cache: "no-store",
      },
    );
  } catch (cause) {
    throw new JotformError("network failure", { cause });
  }

  if (!response.ok) {
    throw new JotformError(`jotform responded ${response.status}`);
  }

  // Jotform can answer HTTP 200 with a failing responseCode in the JSON body.
  const payload = (await response.json().catch(() => null)) as {
    responseCode?: number;
  } | null;
  if (payload && typeof payload.responseCode === "number" && payload.responseCode !== 200) {
    throw new JotformError(`jotform responseCode ${payload.responseCode}`);
  }
}
