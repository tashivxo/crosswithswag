import { ImageResponse } from "next/og";
import { meta } from "@/lib/copy";

export const alt = meta.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          color: "#D6D1C4",
          padding: "72px 80px",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.28em" }}>
          SWAG.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            CROSS
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: "#8C5E4A",
            }}
          >
            WITH SWAG
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.22em" }}>
          WEARABLE EDITIONS — CAPE TOWN
        </div>
      </div>
    ),
    { ...size },
  );
}
