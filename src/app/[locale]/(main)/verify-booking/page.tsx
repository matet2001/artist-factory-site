'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

type VerificationState = 'loading' | 'success' | 'error'

export default function VerifyBookingPage() {
    const t = useTranslations('BOOKING')
    const searchParams = useSearchParams()
    const router = useRouter()

    const [state, setState] = useState<VerificationState>('loading')
    const [message, setMessage] = useState('')
    const [bookingsCount, setBookingsCount] = useState(0)

    useEffect(() => {
        const token = searchParams.get('token')

        if (!token) {
            setState('error')
            setMessage('Invalid or missing verification token.')
            return
        }

        verifyBooking(token)
    }, [searchParams])

    const verifyBooking = async (token: string) => {
        try {
            const response = await fetch('/api/bookings/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed')
            }

            setState('success')
            setMessage(data.message || 'Booking successfully verified!')
            setBookingsCount(data.bookings?.length || 0)
        } catch (error: any) {
            setState('error')
            setMessage(error.message || 'Failed to verify booking')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="bg-card rounded-3xl p-8 sm:p-12 border border-primary/20 shadow-2xl text-center">
                    {state === 'loading' && (
                        <div className="space-y-6">
                            <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
                            <h2 className="text-2xl font-bold">{t('VERIFY.LOADING_TITLE')}</h2>
                            <p className="text-muted-foreground">{t('VERIFY.LOADING_DESC')}</p>
                        </div>
                    )}

                    {state === 'success' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-green-500">
                                {t('VERIFY.SUCCESS_TITLE')}
                            </h2>
                            <p className="text-lg text-foreground">{message}</p>
                            {bookingsCount > 0 && (
                                <p className="text-muted-foreground">
                                    {bookingsCount} booking{bookingsCount > 1 ? 's' : ''} verified
                                </p>
                            )}
                            <div className="pt-4 space-y-3">
                                <Button asChild size="lg" className="w-full">
                                    <Link href="/booking">{t('VERIFY.GO_TO_BOOKING')}</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full">
                                    <Link href="/">{t('VERIFY.GO_TO_HOME')}</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {state === 'error' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="mx-auto w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                                <XCircle className="h-12 w-12 text-red-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-red-500">
                                {t('VERIFY.ERROR_TITLE')}
                            </h2>
                            <p className="text-lg text-foreground">{message}</p>
                            <div className="pt-4 space-y-3">
                                <Button asChild size="lg" className="w-full">
                                    <Link href="/booking">{t('VERIFY.GO_TO_BOOKING')}</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full">
                                    <Link href="/">{t('VERIFY.GO_TO_HOME')}</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
