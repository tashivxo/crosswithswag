export type ShopShipMethod = "PAXI_COLLECT" | "PRIVATE_SHIP";

const DEFAULT_PAXI_CENTS = 6000;

export function paxiShippingCents(
  raw: string | undefined = process.env.NEXT_PUBLIC_SHIPPING_PAXI_CENTS,
): number {
  const n = Number.parseInt(raw ?? String(DEFAULT_PAXI_CENTS), 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_PAXI_CENTS;
}

export function shippingCents(method: ShopShipMethod): number {
  return method === "PAXI_COLLECT" ? paxiShippingCents() : 0;
}
