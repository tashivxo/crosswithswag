export function apiBaseUrl(
  raw: string | undefined = process.env.NEXT_PUBLIC_API_URL,
): string | null {
  const trimmed = raw?.trim();
  return trimmed ? trimmed.replace(/\/$/, "") : null;
}

export type CheckoutApiLine = {
  sku: string;
  size: string;
  qty: number;
};

export type CheckoutApiRequest = {
  name: string;
  email: string;
  phone: string;
  lines: CheckoutApiLine[];
  shipMethod: "PAXI_COLLECT" | "PRIVATE_SHIP";
  paxiCode?: string;
  paxiName?: string;
  paxiAddress?: string;
  addressText?: string;
};

export type CheckoutApiResponse = {
  ref: string;
  redirectUrl: string;
  vendorFields: Record<string, string>;
};

export type OrderConfirmation = {
  ref: string;
  status: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
};

export class CheckoutApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutApiError";
  }
}

type FetchLike = typeof fetch;

export async function postCheckout(
  payload: CheckoutApiRequest,
  fetchFn: FetchLike = fetch,
  base: string | null = apiBaseUrl(),
): Promise<CheckoutApiResponse> {
  if (!base) throw new CheckoutApiError("api is not configured");
  const res = await fetchFn(`${base}/v1/checkout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function fetchOrderConfirmation(
  ref: string,
  email: string,
  fetchFn: FetchLike = fetch,
  base: string | null = apiBaseUrl(),
): Promise<OrderConfirmation | null> {
  if (!base) return null;
  const url = `${base}/v1/orders/${encodeURIComponent(ref)}?email=${encodeURIComponent(email)}`;
  const res = await fetchFn(url, { headers: { Accept: "application/json" } });
  if (res.status === 404) return null;
  return parseJson(res);
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "checkout failed. try again.";
    throw new CheckoutApiError(message);
  }
  return data as T;
}
