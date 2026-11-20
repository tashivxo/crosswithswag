export type ShopShipMethod =
  | "PAXI_COLLECT"
  | "PAXI_ECONOMY"
  | "PAXI_SPEED"
  | "PAXI_DOOR"
  | "PRIVATE_SHIP";

const DEFAULT_PAXI_CENTS = 6000;

const METHOD_CENTS: Record<ShopShipMethod, number> = {
  PAXI_COLLECT: 6000,
  PAXI_ECONOMY: 6000,
  PAXI_SPEED: 11000,
  PAXI_DOOR: 12000,
  PRIVATE_SHIP: 0,
};

export function paxiShippingCents(
  raw: string | undefined = process.env.NEXT_PUBLIC_SHIPPING_PAXI_CENTS,
): number {
  const n = Number.parseInt(raw ?? String(DEFAULT_PAXI_CENTS), 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_PAXI_CENTS;
}

/** Legacy env override applies to economy / PAXI_COLLECT only. */
export function shippingCents(method: ShopShipMethod): number {
  if (method === "PAXI_COLLECT" || method === "PAXI_ECONOMY") {
    return paxiShippingCents();
  }
  return METHOD_CENTS[method];
}

export function isPaxiPickup(method: ShopShipMethod): boolean {
  return (
    method === "PAXI_COLLECT" ||
    method === "PAXI_ECONOMY" ||
    method === "PAXI_SPEED"
  );
}

export function needsDeliveryAddress(method: ShopShipMethod): boolean {
  return method === "PAXI_DOOR" || method === "PRIVATE_SHIP";
}