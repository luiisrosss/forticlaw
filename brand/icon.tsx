import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: '-1px',
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
