'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const LOCALES = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

function getInitialLocale(): string {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/)
    return match?.[1] ?? 'en'
  }
  return 'en'
}

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<string>(getInitialLocale)

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0]

  const switchLocale = (code: string) => {
    document.cookie = `locale=${code}; path=/; max-age=31536000`
    setCurrentLocale(code)
    setOpen(false)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
        aria-label="Switch language"
      >
        <span>{current.flag}</span>
        <span className="font-medium">{current.label}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => switchLocale(locale.code)}
                className={cn(
                  'flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-zinc-800',
                  currentLocale === locale.code
                    ? 'text-zinc-100'
                    : 'text-zinc-400'
                )}
              >
                <span>{locale.flag}</span>
                <span>{locale.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
