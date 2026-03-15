import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
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
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: "-6px",
            fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
          }}
        >
          Fo
        </span>
      </div>
    ),
    { ...size }
  )
}
