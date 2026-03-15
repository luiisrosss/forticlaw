# Codex prompt — implement Forticlaw branding in Next.js 14

## Task
Implement the Forticlaw brand identity across the entire Next.js 14 App Router project. Apply the favicon, logo component, metadata, and navbar branding consistently.

## Brand specs
- **Product name:** Forticlaw
- **Favicon lettermark:** "Fo" — black square (rx=18), white inner border (opacity 0.15), white bold text
- **Primary color:** #0a0a0a (near-black)
- **Background:** #0a0a0a (dark)
- **Text:** white on dark, #0a0a0a on light
- **Font for logo/wordmark:** Arial Black, 900 weight, letter-spacing -0.5px

---

## Step 1 — Add favicon files

Copy these files into `app/`:
- `icon.tsx` → `app/icon.tsx`
- `apple-icon.tsx` → `app/apple-icon.tsx`

These use `next/og` ImageResponse to generate the favicon dynamically. No additional config needed — Next.js picks them up automatically.

---

## Step 2 — Create a reusable Logo component

Create `components/logo.tsx`:

```tsx
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  href?: string
}

const sizes = {
  sm: { icon: 28, fontSize: 14, letterSpacing: '-1px', gap: 8, textSize: 15 },
  md: { icon: 36, fontSize: 18, letterSpacing: '-1.5px', gap: 10, textSize: 18 },
  lg: { icon: 48, fontSize: 24, letterSpacing: '-2px', gap: 12, textSize: 24 },
}

export function Logo({ size = 'md', showWordmark = true, href = '/' }: LogoProps) {
  const s = sizes[size]

  const icon = (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      <div
        style={{
          width: s.icon,
          height: s.icon,
          borderRadius: Math.round(s.icon * 0.22),
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.12)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: s.fontSize,
            fontWeight: 900,
            fontFamily: "'Arial Black', sans-serif",
            letterSpacing: s.letterSpacing,
            lineHeight: 1,
          }}
        >
          Fo
        </span>
      </div>
      {showWordmark && (
        <span
          style={{
            fontSize: s.textSize,
            fontWeight: 900,
            fontFamily: "'Arial Black', sans-serif",
            letterSpacing: '-0.5px',
            color: 'white',
            lineHeight: 1,
          }}
        >
          Forticlaw
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex' }}>
        {icon}
      </Link>
    )
  }

  return icon
}
```

Usage examples:
- Navbar: `<Logo size="md" showWordmark={true} />`
- Favicon context: `<Logo size="sm" showWordmark={false} />`
- Hero/splash: `<Logo size="lg" showWordmark={true} />`

---

## Step 3 — Update root metadata in `app/layout.tsx`

Replace or update the metadata export:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Forticlaw — AI ad creatives for ecommerce',
    template: '%s | Forticlaw',
  },
  description:
    'Generate scroll-stopping Facebook and Instagram ad creatives in under 60 seconds. Paste your product URL, get a full batch of brand-consistent images and copy — powered by AI.',
  keywords: ['dropshipping', 'ad creatives', 'facebook ads', 'ecommerce', 'AI', 'Shopify'],
  authors: [{ name: 'Forticlaw' }],
  creator: 'Forticlaw',
  metadataBase: new URL('https://forticlaw.com'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    url: 'https://forticlaw.com',
    siteName: 'Forticlaw',
    title: 'Forticlaw — AI ad creatives for ecommerce',
    description:
      'Generate scroll-stopping Facebook ads in under 60 seconds. AI-powered, brand-consistent, built for dropshippers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Forticlaw — AI ad creatives for ecommerce',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forticlaw — AI ad creatives for ecommerce',
    description: 'Generate scroll-stopping Facebook ads in under 60 seconds.',
    images: ['/og-image.png'],
    creator: '@forticlaw',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

---

## Step 4 — Update the navbar

Find the navbar/header component (likely in `components/layout/navbar.tsx` or `app/(marketing)/layout.tsx`) and:

1. Replace any "Acme" text or logo placeholder with `<Logo size="md" showWordmark={true} />`
2. Import: `import { Logo } from '@/components/logo'`
3. Make sure the navbar has `background: #0a0a0a` or `bg-[#0a0a0a]` if using Tailwind

---

## Step 5 — Add the SVG files as static assets

Copy the SVG brand files into `public/brand/`:
- `public/brand/favicon.svg`
- `public/brand/logo-icon-512.svg`
- `public/brand/wordmark-dark-text.svg`
- `public/brand/wordmark-white-text.svg`

These are available for use in emails (Resend templates), OG images, and documentation.

---

## Step 6 — Create OG image

Create `app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Forticlaw — AI ad creatives for ecommerce'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: 'white', fontSize: 42, fontWeight: 900, letterSpacing: '-3px' }}>
            Fo
          </span>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-2px',
          }}
        >
          Forticlaw
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          AI ad creatives for ecommerce & dropshipping
        </div>
      </div>
    ),
    { ...size }
  )
}
```

---

## Checklist for Codex

- [ ] `app/icon.tsx` created
- [ ] `app/apple-icon.tsx` created  
- [ ] `app/opengraph-image.tsx` created
- [ ] `components/logo.tsx` created with Logo component
- [ ] `app/layout.tsx` metadata updated
- [ ] Navbar updated to use `<Logo />` component, "Acme" removed
- [ ] SVG files copied to `public/brand/`
- [ ] No "Acme" references remaining in the codebase (`grep -r "Acme" .` should return nothing)
- [ ] Run `npm run build` to verify no TypeScript errors
