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

interface CombinedBooking {
    roomId: string
    startTime: number
    endTime: number
    bookingIds: string[]
}

export function BookingSummary({
    plannedBookings,
    isSubmitting,
    onConfirm,
    animations,
}: BookingSummaryProps) {
    const t = useTranslations('BOOKING')
    const tRooms = useTranslations('ROOMS')

    // Combine consecutive bookings for the same room
    const combineBookings = (bookings: BookingData[]): CombinedBooking[] => {
        if (bookings.length === 0) return []

        // Sort bookings by room and time
        const sorted = [...bookings].sort((a, b) => {
            if (a.roomId !== b.roomId) return a.roomId.localeCompare(b.roomId)
            return a.time - b.time
        })

        const combined: CombinedBooking[] = []
        let current: CombinedBooking = {
            roomId: sorted[0].roomId,
            startTime: sorted[0].time,
            endTime: sorted[0].time + 1,
            bookingIds: [sorted[0].id],
        }

        for (let i = 1; i < sorted.length; i++) {
            const booking = sorted[i]

            // Check if this booking is consecutive to the current one
            if (booking.roomId === current.roomId && booking.time === current.endTime) {
                // Extend the current combined booking
                current.endTime = booking.time + 1
                current.bookingIds.push(booking.id)
            } else {
                // Save the current combined booking and start a new one
                combined.push(current)
                current = {
                    roomId: booking.roomId,
                    startTime: booking.time,
                    endTime: booking.time + 1,
                    bookingIds: [booking.id],
                }
            }
        }

        // Add the last combined booking
        combined.push(current)
        return combined
    }

    const combinedBookings = combineBookings(plannedBookings)

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
                            {t('SELECTED_BOOKINGS', { count: plannedBookings.length })}
                        </h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {combinedBookings.map((booking, index) => {
                                const room = rooms.find((r) => r.id === booking.roomId)
                                return (
                                    <li key={`${booking.roomId}-${booking.startTime}-${index}`}>
                                        {tRooms(room?.name || '')} {booking.startTime}:00 -{' '}
                                        {booking.endTime}:00
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
