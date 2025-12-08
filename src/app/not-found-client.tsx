'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface NotFoundClientProps {
    locale: string
    translations: {
        title: string
        description: string
        goHome: string
        goBooking: string
        redirectMessage: string
    }
}

export function NotFoundClient({ locale, translations }: NotFoundClientProps) {
    const router = useRouter()
    const [countdown, setCountdown] = useState(8)

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return

        const timer = setTimeout(() => {
            setCountdown(countdown - 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [countdown])

    // Redirect when countdown reaches 0
    useEffect(() => {
        if (countdown === 0) {
            router.push(`/${locale}`)
        }
    }, [countdown, router, locale])

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="mt-4 text-3xl font-semibold">{translations.title}</h2>
            <p className="mt-2 text-muted-foreground">{translations.description}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                    <Link href={`/${locale}`}>{translations.goHome}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href={`/${locale}/booking`}>{translations.goBooking}</Link>
                </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
                {translations.redirectMessage.replace('{seconds}', countdown.toString())}
            </p>
        </div>
    )
}
