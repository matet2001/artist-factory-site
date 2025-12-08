import { routing } from '@/i18n/routing'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'
import Providers from './providers'
import { LocalBusinessStructuredData, WebSiteStructuredData } from '@/components/common/structured-data'

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
            <Providers>
                <LocalBusinessStructuredData />
                <WebSiteStructuredData />
                {children}
                <Toaster position="top-center" richColors closeButton />
            </Providers>
        </NextIntlClientProvider>
    )
}
