import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
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
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: "-1px",
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
