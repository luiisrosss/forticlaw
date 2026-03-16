'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Folders,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CreditCard,
  ArrowUp,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UserButton } from '@clerk/nextjs'
import { Drawer } from 'vaul'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { SidebarNavItem } from './sidebar-nav-item'
import { TooltipProvider } from '@/components/ui/tooltip'

const MOCK_PROJECTS = [
  { id: '1', name: 'Nike Air Store' },
  { id: '2', name: 'Gadgets Shop' },
  { id: '3', name: 'Beauty Brand' },
]

const MOCK_CREDITS = { used: 13, total: 100 }

interface SidebarContentProps {
  collapsed: boolean
  onCollapsedChange: (value: boolean) => void
}

function SidebarContent({ collapsed, onCollapsedChange }: SidebarContentProps) {
  const [projectsOpen, setProjectsOpen] = useState(true)
  const pathname = usePathname()
  const t = useTranslations()

  const creditsRemaining = MOCK_CREDITS.total - MOCK_CREDITS.used
  const creditsPercent = Math.round(
    (creditsRemaining / MOCK_CREDITS.total) * 100
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col bg-zinc-950">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
          {collapsed ? (
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <Logo size="sm" showWordmark={false} href="/dashboard" />
              <button
                onClick={() => onCollapsedChange(false)}
                className="rounded-md p-0.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
                aria-label={t('sidebar.expand')}
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <>
              <Logo size="sm" href="/dashboard" />
              <button
                onClick={() => onCollapsedChange(true)}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
                aria-label={t('sidebar.collapse')}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {/* Dashboard */}
          <SidebarNavItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4 shrink-0" />}
            label={t('nav.dashboard')}
            active={pathname === '/dashboard'}
            collapsed={collapsed}
          />

          {/* Projects section */}
          <div>
            <button
              onClick={() => setProjectsOpen((v) => !v)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                pathname.startsWith('/dashboard/projects')
                  ? 'bg-zinc-900 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100',
                collapsed && 'justify-center px-2'
              )}
            >
              <Folders className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{t('nav.projects')}</span>
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 transition-transform duration-200',
                      !projectsOpen && '-rotate-90'
                    )}
                  />
                </>
              )}
            </button>

            {!collapsed && projectsOpen && (
              <div className="ml-4 mt-0.5 max-h-40 space-y-0.5 overflow-y-auto border-l border-white/5 pl-2.5">
                {MOCK_PROJECTS.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/projects/${p.id}`}
                    className={cn(
                      'block truncate rounded-md px-2.5 py-1.5 text-xs transition-colors',
                      pathname === `/dashboard/projects/${p.id}`
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
                    )}
                  >
                    {p.name}
                  </Link>
                ))}
                <Link
                  href="/dashboard/projects"
                  className="block truncate rounded-md px-2.5 py-1.5 text-xs text-zinc-600 transition-colors hover:text-zinc-400"
                >
                  {t('nav.allProjects')}
                </Link>
              </div>
            )}
          </div>

          {/* Settings */}
          <SidebarNavItem
            href="/dashboard/settings"
            icon={<Settings className="h-4 w-4 shrink-0" />}
            label={t('nav.settings')}
            active={pathname === '/dashboard/settings'}
            collapsed={collapsed}
          />
        </nav>

        {/* Credits */}
        <div className="px-3 py-2">
          <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
            {!collapsed ? (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {creditsRemaining} {t('sidebar.credits')}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {MOCK_CREDITS.used}/{MOCK_CREDITS.total}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-zinc-300 transition-all"
                    style={{ width: `${creditsPercent}%` }}
                  />
                </div>
              </>
            ) : (
              <Link
                href="/dashboard/settings/billing"
                className="flex flex-col items-center gap-1.5 group"
                aria-label="Upgrade plan or add credits"
              >
                <CreditCard className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-zinc-300" />
                <ArrowUp className="h-3 w-3 text-zinc-600 transition-colors group-hover:text-zinc-400" />
              </Link>
            )}
          </div>
        </div>

        {/* User */}
        <div className="border-t border-white/10 px-3 py-3">
          <div
            className={cn(
              'flex items-center gap-2',
              collapsed && 'justify-center'
            )}
          >
            <UserButton />
            {!collapsed && (
              <span className="flex-1 truncate text-sm text-zinc-300">
                Luis Rosales
              </span>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (value: boolean) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 hidden h-screen border-r border-white/10 transition-all duration-300 lg:block',
          collapsed ? 'w-14' : 'w-60'
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapsedChange={onCollapsedChange}
        />
      </aside>

      {/* Mobile drawer */}
      <Drawer.Root
        open={mobileOpen}
        onOpenChange={(open) => !open && onMobileClose()}
        direction="left"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
          <Drawer.Content className="fixed left-0 top-0 z-50 h-screen w-60 border-r border-white/10 bg-zinc-950 focus:outline-none lg:hidden">
            <SidebarContent collapsed={false} onCollapsedChange={() => {}} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
