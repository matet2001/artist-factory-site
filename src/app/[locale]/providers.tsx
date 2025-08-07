'use client'

import { NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner' // or wherever your toast is

type ProvidersProps = {
    children: ReactNode
    locale: string
    messages: Record<string, any>
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster richColors position="top-center" />
        </NextIntlClientProvider>
    )
}
