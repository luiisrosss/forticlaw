import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const supportedLocales = ['en', 'es'] as const
type Locale = (typeof supportedLocales)[number]

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const rawLocale = cookieStore.get('locale')?.value
  const locale: Locale = supportedLocales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : 'en'

  const messages =
    locale === 'es'
      ? (await import('./messages/es.json')).default
      : (await import('./messages/en.json')).default

  return {
    locale,
    messages,
  }
})
