import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { NotFoundClient } from './not-found-client'
import { headers } from 'next/headers'

export default async function NotFound() {
    // Try to detect locale from the URL path or use default
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || headersList.get('referer') || ''

    // Extract locale from pathname if it exists
    let locale = routing.defaultLocale
    for (const l of routing.locales) {
        if (pathname.includes(`/${l}/`) || pathname.endsWith(`/${l}`)) {
            locale = l
            break
        }
    }

    const t = await getTranslations({ locale, namespace: 'NOT_FOUND' })

    return (
        <NotFoundClient
            locale={locale}
            translations={{
                title: t('TITLE'),
                description: t('DESCRIPTION'),
                goHome: t('GO_HOME'),
                goBooking: t('GO_BOOKING'),
                redirectMessage: t.raw('REDIRECT_MESSAGE'),
            }}
        />
    )
}
