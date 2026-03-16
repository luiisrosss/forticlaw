'use client'

import { usePathname } from 'next/navigation'
import { Menu, Plus } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

const PATH_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  settings: 'Settings',
  onboarding: 'Onboarding',
  'brand-kit': 'Brand Kit',
  memory: 'Memory',
  'ai-settings': 'AI Settings',
  billing: 'Billing',
  new: 'New',
  creatives: 'Creatives',
}

function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((seg) => PATH_LABELS[seg] ?? seg)

  return (
    <div className="flex items-center gap-1.5 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-zinc-600">/</span>}
          <span
            className={
              i === crumbs.length - 1
                ? 'font-medium text-zinc-100'
                : 'text-zinc-500'
            }
          >
            {crumb}
          </span>
        </span>
      ))}
    </div>
  )
}

interface TopbarProps {
  onMobileMenuOpen: () => void
  sidebarCollapsed: boolean
}

export function Topbar({ onMobileMenuOpen, sidebarCollapsed }: TopbarProps) {
  const t = useTranslations()

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-20 flex h-14 items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur-sm transition-[left] duration-300',
        'left-0',
        sidebarCollapsed ? 'lg:left-14' : 'lg:left-60'
      )}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1">
        <Breadcrumb />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-zinc-200 sm:flex">
          <Plus className="h-3.5 w-3.5" />
          {t('topbar.newCreative')}
        </button>
        <UserButton />
      </div>
    </header>
  )
}
