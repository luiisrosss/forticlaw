import Link from "next/link"
import { Twitter, Linkedin } from "lucide-react"

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Waitlist", href: "#waitlist" },
  { label: "Privacy", href: "/privacy" },
]

export function FooterSection() {
  return (
    <footer className="px-6 py-16 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <Link href="/" className="font-display text-xl font-semibold text-zinc-100">
              Forticlaw
            </Link>
            <p className="mt-4 text-sm text-zinc-500 max-w-xs">
              AI ad creatives for dropshippers and ecommerce sellers.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-zinc-100 mb-4">Quick links</h4>
            <ul className="grid grid-cols-2 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} Forticlaw. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/Luis82938981"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/luis-ros-0b64723a0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
