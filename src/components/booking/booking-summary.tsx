'use client'

import { Button } from '@/components/ui/button'

import { BookingData } from '@/lib/booking-utils'
import { rooms } from '@/lib/rooms'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import BookingTermsConsent from './booking-terms-consent'

interface BookingSummaryProps {
    plannedBookings: BookingData[]
    isSubmitting: boolean
    onConfirm: () => void
    animations: any
}

interface CombinedBooking {
    roomId: string
    date: Date
    startTime: number
    endTime: number
    bookingIds: string[]
}

interface BookingsByDate {
    date: Date
    dateStr: string
    bookings: CombinedBooking[]
}

export function BookingSummary({
    plannedBookings,
    isSubmitting,
    onConfirm,
    animations,
}: BookingSummaryProps) {
    const t = useTranslations('BOOKING')
    const tRooms = useTranslations('ROOMS')
    const locale = useLocale()
    const [termsAccepted, setTermsAccepted] = useState(false)

    const handleConfirm = () => {
        if (!termsAccepted) {
            toast.error(t('TERMS_REQUIRED'))
            return
        }
        onConfirm()
    }

    // Group and combine bookings by date
    const groupBookingsByDate = (bookings: BookingData[]): BookingsByDate[] => {
        if (bookings.length === 0) return []

        // Sort bookings by date, room, and time
        const sorted = [...bookings].sort((a, b) => {
            const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
            if (dateCompare !== 0) return dateCompare
            if (a.roomId !== b.roomId) return a.roomId.localeCompare(b.roomId)
            return a.time - b.time
        })

        // Group by date
        const dateGroups = new Map<string, BookingData[]>()
        sorted.forEach((booking) => {
            const dateStr = new Date(booking.date).toLocaleDateString()
            if (!dateGroups.has(dateStr)) {
                dateGroups.set(dateStr, [])
            }
            dateGroups.get(dateStr)!.push(booking)
        })

        // Combine consecutive bookings within each date group
        const result: BookingsByDate[] = []
        dateGroups.forEach((bookings, dateStr) => {
            const combined: CombinedBooking[] = []
            let current: CombinedBooking = {
                roomId: bookings[0].roomId,
                date: new Date(bookings[0].date),
                startTime: bookings[0].time,
                endTime: bookings[0].time + 1,
                bookingIds: [bookings[0].id],
            }

            for (let i = 1; i < bookings.length; i++) {
                const booking = bookings[i]

                // Check if consecutive booking for same room
                if (booking.roomId === current.roomId && booking.time === current.endTime) {
                    current.endTime = booking.time + 1
                    current.bookingIds.push(booking.id)
                } else {
                    combined.push(current)
                    current = {
                        roomId: booking.roomId,
                        date: new Date(booking.date),
                        startTime: booking.time,
                        endTime: booking.time + 1,
                        bookingIds: [booking.id],
                    }
                }
            }
            combined.push(current)

            result.push({
                date: new Date(bookings[0].date),
                dateStr,
                bookings: combined,
            })
        })

        return result
    }

    const bookingsByDate = groupBookingsByDate(plannedBookings)

    return (
        <motion.div variants={animations.fadeUp} className="mt-12 max-w-3xl mx-auto">
            <div className="">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                    {t('FINALIZE_ORDER')}
                </h2>
                <p className="text-center text-muted-foreground mb-6">{t('ORDER_DISCLAIM')}</p>

                {plannedBookings.length > 0 && (
                    <>
                        <div className="mb-6 p-4 bg-card rounded-lg">
                            <h3 className="font-semibold mb-2">
                                {t('SELECTED_BOOKINGS', { count: plannedBookings.length })}
                            </h3>
                            <div className="space-y-4">
                                {bookingsByDate.map((dateGroup, dateIndex) => (
                                    <div key={dateIndex}>
                                        <h4 className="text-sm font-semibold text-foreground mb-2">
                                            {dateGroup.date.toLocaleDateString(locale === 'hu' ? 'hu-HU' : 'en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground pl-4">
                                            {dateGroup.bookings.map((booking, index) => {
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
                                ))}
                            </div>
                        </div>

                        <BookingTermsConsent
                            setTermsAccepted={setTermsAccepted}
                            termsAccepted={termsAccepted}
                        />
                    </>
                )}

                <Button
                    size="lg"
                    className="w-full mt-10"
                    disabled={plannedBookings.length === 0 || isSubmitting}
                    onClick={handleConfirm}
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
