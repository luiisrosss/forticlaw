'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarNavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
}

export function SidebarNavItem({
  href,
  icon,
  label,
  active,
  collapsed,
}: SidebarNavItemProps) {
  const item = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
        active
          ? 'bg-zinc-900 text-zinc-100'
          : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100',
        collapsed && 'justify-center px-2'
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="border-white/10 bg-zinc-800 text-zinc-100"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return item
}
