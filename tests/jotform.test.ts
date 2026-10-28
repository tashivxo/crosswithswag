import { describe, expect, it } from "vitest";
import { JotformError, readJotformConfig, submitToJotform } from "@/lib/jotform";

const config = {
  apiKey: "key-123",
  formId: "999",
  emailQid: "3",
  consentQid: "5",
  consentValue: "I agree",
  apiBase: "https://api.jotform.com",
};

type Call = { url: string; init: RequestInit };

function recordingFetch(response: Response) {
  const calls: Call[] = [];
  const fetchImpl = async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return response;
  };
  return { calls, fetchImpl: fetchImpl as typeof fetch };
}

describe("readJotformConfig", () => {
  it("returns null when any required value is missing", () => {
    expect(readJotformConfig({})).toBeNull();
    expect(
      readJotformConfig({ JOTFORM_API_KEY: "k", JOTFORM_FORM_ID: "1" }),
    ).toBeNull();
  });

  it("reads the full config and applies defaults", () => {
    const result = readJotformConfig({
      JOTFORM_API_KEY: "k",
      JOTFORM_FORM_ID: "1",
      JOTFORM_EMAIL_QID: "3",
      JOTFORM_CONSENT_QID: "5",
    });
    expect(result).toEqual({
      apiKey: "k",
      formId: "1",
      emailQid: "3",
      consentQid: "5",
      consentValue: "Yes",
      apiBase: "https://api.jotform.com",
    });
  });

  it("honours consent value and API base overrides", () => {
    const result = readJotformConfig({
      JOTFORM_API_KEY: "k",
      JOTFORM_FORM_ID: "1",
      JOTFORM_EMAIL_QID: "3",
      JOTFORM_CONSENT_QID: "5",
      JOTFORM_CONSENT_VALUE: "I agree",
      JOTFORM_API_BASE: "https://eu-api.jotform.com",
    });
    expect(result?.consentValue).toBe("I agree");
    expect(result?.apiBase).toBe("https://eu-api.jotform.com");
  });
});

describe("submitToJotform", () => {
  it("posts a form-encoded submission with the API key in a header", async () => {
    const { calls, fetchImpl } = recordingFetch(
      new Response(JSON.stringify({ responseCode: 200 }), { status: 200 }),
    );

    await submitToJotform(
      { email: "marcus@example.com", consent: true },
      config,
      fetchImpl,
    );

    expect(calls).toHaveLength(1);
    const [call] = calls;
    expect(call.url).toBe("https://api.jotform.com/form/999/submissions");
    expect(call.init.method).toBe("POST");
    expect((call.init.headers as Record<string, string>).APIKEY).toBe("key-123");

    const body = new URLSearchParams(String(call.init.body));
    expect(body.get("submission[3]")).toBe("marcus@example.com");
    expect(body.get("submission[5][0]")).toBe("I agree");
  });

  it("never puts the API key in the URL or body", async () => {
    const { calls, fetchImpl } = recordingFetch(new Response("{}", { status: 200 }));
    await submitToJotform({ email: "a@b.co", consent: true }, config, fetchImpl);
    expect(calls[0].url).not.toContain("key-123");
    expect(String(calls[0].init.body)).not.toContain("key-123");
  });

  it("throws JotformError on a non-2xx response", async () => {
    const { fetchImpl } = recordingFetch(new Response("nope", { status: 401 }));
    await expect(
      submitToJotform({ email: "a@b.co", consent: true }, config, fetchImpl),
    ).rejects.toBeInstanceOf(JotformError);
  });

  it("throws JotformError when Jotform returns a non-200 responseCode in a 200 body", async () => {
    const { fetchImpl } = recordingFetch(
      new Response(JSON.stringify({ responseCode: 401, message: "bad key" }), {
        status: 200,
      }),
    );
    await expect(
      submitToJotform({ email: "a@b.co", consent: true }, config, fetchImpl),
    ).rejects.toBeInstanceOf(JotformError);
  });

  it("wraps network failures in JotformError", async () => {
    const fetchImpl = (async () => {
      throw new Error("offline");
    }) as typeof fetch;
    await expect(
      submitToJotform({ email: "a@b.co", consent: true }, config, fetchImpl),
    ).rejects.toBeInstanceOf(JotformError);
  });
});
