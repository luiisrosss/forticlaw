import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/providers/lenis-provider"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: {
    default: "Forticlaw - AI ad creatives for ecommerce",
    template: "%s | Forticlaw",
  },
  description:
    "Generate scroll-stopping Facebook and Instagram ad creatives in under 60 seconds. Paste your product URL, get a draft, and export a brand-consistent batch powered by AI.",
  keywords: ["dropshipping", "ad creatives", "facebook ads", "instagram ads", "ecommerce", "AI", "Shopify"],
  authors: [{ name: "Forticlaw" }],
  creator: "Forticlaw",
  metadataBase: new URL("https://forticlaw.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forticlaw.com",
    siteName: "Forticlaw",
    title: "Forticlaw - AI ad creatives for ecommerce",
    description:
      "Paste a product URL, get a draft in seconds, and export every ratio your paid campaigns need.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Forticlaw - AI ad creatives for ecommerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forticlaw - AI ad creatives for ecommerce",
    description: "Paste a product URL, get a draft in seconds, and export every ratio your paid campaigns need.",
    images: ["/opengraph-image"],
    creator: "@forticlaw",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/" signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en" className="dark">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Instrument+Sans:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={`${manrope.variable} bg-[#0a0a0a] font-sans text-zinc-100 antialiased`}>
          <LenisProvider>{children}</LenisProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
