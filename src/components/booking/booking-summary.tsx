'use client'

import { Button } from '@/components/ui/button'

import { BookingData, toDateKey } from '@/lib/booking-utils'
import { rooms } from '@/lib/rooms'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock, Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import BookingTermsConsent from './booking-terms-consent'

interface BookingSummaryProps {
    plannedBookings: BookingData[]
    isSubmitting: boolean
    onConfirm: () => void
    animations: any
    /** How long a picked slot is held before other visitors can take it. */
    holdMinutes: number
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
    holdMinutes,
}: BookingSummaryProps) {
    const t = useTranslations('BOOKING')
    const tRooms = useTranslations('ROOMS')
    const locale = useLocale()
    const [termsAccepted, setTermsAccepted] = useState(false)
    // Null until the first client tick so the server and the client render the
    // same markup — a live clock in the initial HTML would fail hydration.
    const [now, setNow] = useState<number | null>(null)

    useEffect(() => {
        setNow(Date.now())
        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    const firstExpiry = useMemo(() => {
        const times = plannedBookings
            .map((b) => (b.expiresAt ? new Date(b.expiresAt).getTime() : null))
            .filter((value): value is number => value !== null)

        return times.length > 0 ? Math.min(...times) : null
    }, [plannedBookings])

    const countdown = useMemo(() => {
        if (now === null || firstExpiry === null) return null

        const remaining = Math.max(0, firstExpiry - now)
        const minutes = Math.floor(remaining / 60000)
        const seconds = Math.floor((remaining % 60000) / 1000)

        return {
            expired: remaining === 0,
            label: `${minutes}:${String(seconds).padStart(2, '0')}`,
        }
    }, [now, firstExpiry])

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
            const dateStr = toDateKey(booking.date)
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
        <motion.div variants={animations.fadeUp} className="mt-6 md:mt-12 max-w-3xl mx-auto px-2 md:px-0">
            <div className="">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-3 md:mb-4">
                    {t('FINALIZE_ORDER')}
                </h2>
                <p className="text-center text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">{t('ORDER_DISCLAIM')}</p>

                {plannedBookings.length > 0 && (
                    <>
                        <div className="mb-4 md:mb-6 p-2 md:p-4 bg-card rounded-lg">
                            <h3 className="font-semibold mb-2 text-sm md:text-base">
                                {t('SELECTED_BOOKINGS', { count: plannedBookings.length })}
                            </h3>
                            <div className="mb-4 rounded-lg border-2 border-amber-500/60 bg-amber-500/10 p-3 md:p-4">
                                <div className="flex items-start gap-2 md:gap-3">
                                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-amber-400 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-xs md:text-sm font-semibold text-amber-200">
                                            {t('HOLD_WARNING_TITLE')}
                                        </p>
                                        <p className="text-[11px] md:text-sm text-amber-100/80 leading-relaxed">
                                            {t('HOLD_WARNING_DESC', { minutes: holdMinutes })}
                                        </p>
                                        {countdown && (
                                            <p className="flex items-center gap-1.5 text-[11px] md:text-sm font-medium text-amber-200 pt-0.5">
                                                <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                                                {countdown.expired
                                                    ? t('HOLD_EXPIRED')
                                                    : t('HOLD_EXPIRES_IN', {
                                                          time: countdown.label,
                                                      })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 md:space-y-4">
                                {bookingsByDate.map((dateGroup, dateIndex) => (
                                    <div key={dateIndex}>
                                        <h4 className="text-xs md:text-sm font-semibold text-foreground mb-1 md:mb-2">
                                            {new Date(
                                                `${dateGroup.dateStr}T12:00:00`
                                            ).toLocaleDateString(locale === 'hu' ? 'hu-HU' : 'en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </h4>
                                        <ul className="space-y-0.5 md:space-y-1 text-[10px] md:text-sm text-muted-foreground pl-2 md:pl-4">
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
                    className="w-full mt-6 md:mt-10"
                    disabled={plannedBookings.length === 0 || isSubmitting}
                    onClick={handleConfirm}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                            <span className="text-sm md:text-base">{t('PROCESSING')}</span>
                        </>
                    ) : (
                        <span className="text-sm md:text-base">{t('SUBMIT')}</span>
                    )}
                </Button>
            </div>
        </motion.div>
    )
}
