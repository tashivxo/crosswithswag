export const PAXI_MAP_SRC =
  "https://map.paxi.co.za?size=l,m,s&status=1,3,4&maxordervalue=1000&output=nc";

export const PAXI_MAP_PAGE = "https://map.paxi.co.za";

export type PaxiPoint = {
  code: string;
  name: string;
  address: string;
};

export function isPaxiOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return host === "paxi.co.za" || host.endsWith(".paxi.co.za");
  } catch {
    return false;
  }
}

export function paxiPointFromMessage(data: unknown): PaxiPoint | null {
  if (typeof data === "string") {
    const code = data.trim();
    return isStoreCode(code) ? { code, name: "", address: "" } : null;
  }
  if (!data || typeof data !== "object") return null;
  const rec = data as Record<string, unknown>;
  for (const key of ["point", "store", "location", "data"]) {
    const nested = rec[key];
    if (nested && typeof nested === "object") {
      const fromNested = paxiPointFromMessage(nested);
      if (fromNested) return fromNested;
    }
  }
  const code = firstString(rec, [
    "code",
    "paxi_code",
    "paxiCode",
    "storeCode",
    "PointCode",
    "pointcode",
  ]);
  if (!code || !isStoreCode(code)) return null;
  return {
    code,
    name:
      firstString(rec, ["name", "paxi_name", "paxiName", "storeName", "PointName"]) ??
      "",
    address:
      firstString(rec, [
        "address",
        "paxi_address",
        "paxiAddress",
        "formatted_address",
      ]) ?? "",
  };
}

function isStoreCode(code: string): boolean {
  return /^[A-Z0-9][A-Z0-9-]{2,19}$/i.test(code.trim());
}

function firstString(
  rec: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = rec[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}
