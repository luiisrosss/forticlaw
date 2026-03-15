import Link from "next/link"
import { Linkedin, Twitter } from "lucide-react"
import { Logo } from "@/components/logo"

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#how-it-works" },
  { label: "Early access", href: "#waitlist" },
  { label: "Privacy", href: "/privacy" },
]

export function FooterSection() {
  return (
    <footer className="border-t border-zinc-900 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <Logo size="md" />
            <p className="mt-4 max-w-xs text-sm text-zinc-500">
              AI ad creatives for ecommerce sellers who need speed, consistency, and export-ready output.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-zinc-100">Quick links</h4>
            <ul className="grid grid-cols-2 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-8 md:flex-row">
          <p className="text-sm text-zinc-600">&copy; {new Date().getFullYear()} Forticlaw. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/Luis82938981"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 transition-colors hover:text-zinc-300"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/luis-ros-0b64723a0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 transition-colors hover:text-zinc-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
