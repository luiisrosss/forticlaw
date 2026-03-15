"use client"

import { ReactLenis } from "@studio-freight/react-lenis"
import type { ComponentType, ReactNode } from "react"

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  // Lenis ships its own nested React types, so cast the component once to avoid ReactNode mismatch noise.
  const LenisRoot = ReactLenis as unknown as ComponentType<{
    children: ReactNode
    root: boolean
    options: {
      lerp: number
      duration: number
      smoothWheel: boolean
    }
  }>

  return (
    <LenisRoot root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </LenisRoot>
  )
}
