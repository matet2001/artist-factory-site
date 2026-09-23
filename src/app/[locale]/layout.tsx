import { budapestDateKey } from '@/lib/today'
import { TodayKeyProvider } from '@/components/common/today-provider'
import { routing } from '@/i18n/routing'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'
import Providers from './providers'
import { LocalBusinessStructuredData, WebSiteStructuredData } from '@/components/common/structured-data'

/**
 * These pages are prerendered, but the room rate depends on the calendar day, so
 * a build-time date would stick. Regenerating hourly keeps them cached while the
 * October switchover still lands within the hour of midnight.
 */
export const revalidate = 3600

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }


    // Get messages for the locale
    const messages = await getMessages()

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <TodayKeyProvider todayKey={budapestDateKey()}>
                <Providers>
                    <LocalBusinessStructuredData />
                    <WebSiteStructuredData />
                    {children}
                    <Toaster position="top-center" richColors closeButton />
                </Providers>
            </TodayKeyProvider>
        </NextIntlClientProvider>
    )
}
