import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

const locales = ['es', 'en']
const defaultLocale = 'es'

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as never)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
