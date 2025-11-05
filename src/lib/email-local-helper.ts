import { cookies, headers } from 'next/headers'
import { routing } from '@/i18n/routing'

/**
 * Get the current locale from the request for sending emails
 * Priority:
 * 1. Cookie locale (NEXT_LOCALE)
 * 2. Accept-Language header
 * 3. Default locale (hu)
 */
export async function getLocaleForEmail(): Promise<string> {
    // Try to get locale from cookies (set by next-intl)
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('NEXT_LOCALE')

    if (localeCookie?.value && routing.locales.includes(localeCookie.value as any)) {
        return localeCookie.value
    }

    // Try to get from Accept-Language header as fallback
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language')

    if (acceptLanguage) {
        // Parse accept-language header (e.g., "en-US,en;q=0.9,hu;q=0.8")
        const preferredLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()

        if (routing.locales.includes(preferredLocale as any)) {
            return preferredLocale
        }
    }

    // Fall back to default locale
    return routing.defaultLocale
}

/**
 * Usage in your API routes:
 *
 * import { getLocaleForEmail } from '@/lib/email-locale'
 * import { sendVerificationEmail } from '@/lib/email'
 *
 * // In your registration/forgot-password handler
 * const locale = await getLocaleForEmail()
 * await sendVerificationEmail(email, token, locale)
 */
