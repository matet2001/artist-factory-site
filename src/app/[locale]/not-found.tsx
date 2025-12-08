'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    const t = useTranslations('NOT_FOUND')
    const router = useRouter()
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push('/')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="mt-4 text-3xl font-semibold">{t('TITLE')}</h2>
            <p className="mt-2 text-muted-foreground">{t('DESCRIPTION')}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                    <Link href="/">{t('GO_HOME')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/booking">{t('GO_BOOKING')}</Link>
                </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
                {t('REDIRECT_MESSAGE', { seconds: countdown })}
            </p>
        </div>
    )
}
