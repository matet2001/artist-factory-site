'use client'

import { Button } from '@/components/ui/button'
import { BookingData } from '@/lib/booking-utils'
import { rooms } from '@/lib/rooms'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BookingSummaryProps {
    plannedBookings: BookingData[]
    isSubmitting: boolean
    onConfirm: () => void
    animations: any
}

export function BookingSummary({
    plannedBookings,
    isSubmitting,
    onConfirm,
    animations,
}: BookingSummaryProps) {
    const t = useTranslations('BOOKING')
    const tRooms = useTranslations('ROOMS')

    return (
        <motion.div variants={animations.fadeUp} className="mt-12 max-w-3xl mx-auto">
            <div className="rounded-2xl p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                    {t('FINALIZE_ORDER')}
                </h2>
                <p className="text-center text-muted-foreground mb-6">{t('ORDER_DISCLAIM')}</p>

                {plannedBookings.length > 0 && (
                    <div className="mb-6 p-4 bg-card rounded-lg">
                        <h3 className="font-semibold mb-2">
                            Selected Bookings ({plannedBookings.length}):
                        </h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {plannedBookings.map((booking) => {
                                const room = rooms.find((r) => r.id === booking.roomId)
                                return (
                                    <li key={booking.id}>
                                        {tRooms(room?.name || '')} {booking.time}:00 -{' '}
                                        {booking.time + 1}:00
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}

                <Button
                    size="lg"
                    className="w-full"
                    disabled={plannedBookings.length === 0 || isSubmitting}
                    onClick={onConfirm}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        t('SUBMIT')
                    )}
                </Button>
            </div>
        </motion.div>
    )
}
