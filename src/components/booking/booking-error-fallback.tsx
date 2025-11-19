'use client'

import { CONTACT } from '@/lib/constants'
import { Phone, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BookingErrorFallbackProps {
    error?: Error | null
}

export function BookingErrorFallback({ error }: BookingErrorFallbackProps) {
    const t = useTranslations('BOOKING.ERROR_FALLBACK')

    return (
        <div className="relative bg-gradient-to-br from-card to-card-elevated rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-destructive/20 shadow-2xl">
            <div className="relative z-10">
                <div className="space-y-8 text-center max-w-2xl mx-auto">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                        {t('TITLE')}
                    </h2>

                    {/* Description */}
                    <p className="text-card-muted-foreground text-base sm:text-lg lg:text-xl">
                        {t('DESCRIPTION')}
                    </p>

                    {/* Phone CTA */}
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-lg font-medium">{t('ALTERNATIVE')}</p>
                        <a
                            href={`tel:${CONTACT.phoneRaw}`}
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            {CONTACT.phoneDisplay}
                        </a>
                        <p className="text-sm text-card-muted-foreground">{t('AVAILABILITY')}</p>
                    </div>

                    {/* Error details (for debugging, optional) */}
                    {error && process.env.NODE_ENV === 'development' && (
                        <div className="mt-8 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
                            <p className="text-xs text-destructive font-mono">
                                {error.message}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
