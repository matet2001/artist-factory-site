import { routing } from '@/i18n/routing'
import { cookies, headers } from 'next/headers'

export async function getLocaleForEmail(): Promise<string> {
    // Try to get locale from cookies (set by next-intl)
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('NEXT_LOCALE')

    type Locale = (typeof routing.locales)[number]

    if (localeCookie?.value && routing.locales.includes(localeCookie.value as Locale)) {
        return localeCookie.value
    }

    // Try to get from Accept-Language header as fallback
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language')

    if (acceptLanguage) {
        // Parse accept-language header (e.g., "en-US,en;q=0.9,hu;q=0.8")
        const preferredLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()

        if (routing.locales.includes(preferredLocale as Locale)) {
            return preferredLocale
        }
    }

    // Fall back to default locale
    return routing.defaultLocale
}
