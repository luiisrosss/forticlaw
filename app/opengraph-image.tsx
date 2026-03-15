import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Forticlaw - AI ad creatives for ecommerce"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 84px",
          gap: 28,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 18,
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontSize: 44,
                fontWeight: 900,
                letterSpacing: "-3px",
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
              }}
            >
              Fo
            </span>
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              letterSpacing: "-1.5px",
              fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
            }}
          >
            Forticlaw
          </div>
        </div>

        <div
          style={{
            width: 820,
            fontSize: 68,
            lineHeight: 1.02,
            fontWeight: 800,
            letterSpacing: "-2px",
          }}
        >
          From product URL to launch-ready ad creatives.
        </div>

        <div
          style={{
            width: 760,
            fontSize: 28,
            lineHeight: 1.35,
            color: "rgba(255,255,255,0.68)",
          }}
        >
          Paste a product URL, get a draft in seconds, and export every ratio your paid campaigns need.
        </div>
      </div>
    ),
    { ...size }
  )
}
