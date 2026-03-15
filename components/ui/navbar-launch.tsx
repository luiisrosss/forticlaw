"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "Workflow" },
  { href: "/sign-in", label: "Sign in" },
]

export function NavbarLaunch() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 p-4">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-white/10 bg-[#0a0a0a]/82 px-4 backdrop-blur-md md:px-6">
        <Logo size="md" />
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sign-up"
            className="ml-2 rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-zinc-200"
          >
            Get started
          </Link>
        </div>
        <Link
          href="/sign-up"
          className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-zinc-200 md:hidden"
        >
          Get started
        </Link>
      </nav>
    </header>
  )
}
