"use client";

import { useEffect } from "react";
import { checkoutCopy } from "@/lib/copy";
import {
  PAXI_MAP_PAGE,
  PAXI_MAP_SRC,
  isPaxiOrigin,
  paxiPointFromMessage,
  type PaxiPoint,
} from "@/lib/v4/paxi";

export function PaxiLocator({
  onPoint,
}: {
  onPoint: (point: PaxiPoint) => void;
}) {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isPaxiOrigin(event.origin)) return;
      const point = paxiPointFromMessage(event.data);
      if (point) onPoint(point);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onPoint]);

  return (
    <div className="cm-paxi">
      <p className="lbl cm-note">{checkoutCopy.paxiHint}</p>
      <iframe
        className="cm-paxi__map"
        title="PEP Paxi collect points"
        src={PAXI_MAP_SRC}
        allow="geolocation"
      />
      <a
        className="tlink"
        href={PAXI_MAP_PAGE}
        target="_blank"
        rel="noreferrer"
      >
        {checkoutCopy.paxiMapLink}
      </a>
    </div>
  );
}
