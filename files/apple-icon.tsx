import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: '-6px',
            fontFamily: 'sans-serif',
          }}
        >
          Fo
        </span>
      </div>
    ),
    { ...size }
  )
}
