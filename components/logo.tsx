import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showWordmark?: boolean
  href?: string | null
  color?: "light" | "dark"
  className?: string
}

const sizes = {
  sm: { icon: 28, fontSize: 14, letterSpacing: "-1px", gap: 8, textSize: 15 },
  md: { icon: 36, fontSize: 18, letterSpacing: "-1.5px", gap: 10, textSize: 18 },
  lg: { icon: 48, fontSize: 24, letterSpacing: "-2px", gap: 12, textSize: 24 },
}

export function Logo({
  size = "md",
  showWordmark = true,
  href = "/",
  color = "light",
  className,
}: LogoProps) {
  const currentSize = sizes[size]
  const wordmarkColor = color === "light" ? "#ffffff" : "#0a0a0a"

  const content = (
    <div className={cn("inline-flex items-center", className)} style={{ gap: currentSize.gap }}>
      <div
        aria-hidden="true"
        style={{
          width: currentSize.icon,
          height: currentSize.icon,
          borderRadius: Math.round(currentSize.icon * 0.22),
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.15)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: currentSize.fontSize,
            fontWeight: 900,
            fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
            letterSpacing: currentSize.letterSpacing,
            lineHeight: 1,
          }}
        >
          Fo
        </span>
      </div>
      {showWordmark ? (
        <span
          style={{
            color: wordmarkColor,
            fontSize: currentSize.textSize,
            fontWeight: 900,
            fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          Forticlaw
        </span>
      ) : null}
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Forticlaw home">
      {content}
    </Link>
  )
}
