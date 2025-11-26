'use client'

import { Button } from '@/components/ui/button'
import { BookingIntent } from '@/lib/booking-utils'
import { rooms } from '@/lib/rooms'
import { X } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

interface AdminBookingSummaryProps {
    plannedBookings: BookingIntent[]
    onClearAll: () => void
}

interface CombinedBooking {
    roomId: string
    date: Date
    startTime: number
    endTime: number
}

interface BookingsByDate {
    date: Date
    dateStr: string
    bookings: CombinedBooking[]
}

export function AdminBookingSummary({ plannedBookings, onClearAll }: AdminBookingSummaryProps) {
    const t = useTranslations('ADMIN_BOOKINGS')
    const tRooms = useTranslations('ROOMS')
    const locale = useLocale()

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(locale === 'hu' ? 'hu-HU' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date)
    }

    // Group and combine consecutive bookings by date (like regular booking summary)
    const groupBookingsByDate = (bookings: BookingIntent[]): BookingsByDate[] => {
        if (bookings.length === 0) return []

        // Sort bookings by date, room, and time
        const sorted = [...bookings].sort((a, b) => {
            const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
            if (dateCompare !== 0) return dateCompare
            if (a.roomId !== b.roomId) return a.roomId.localeCompare(b.roomId)
            return a.time - b.time
        })

        // Group by date
        const dateGroups = new Map<string, BookingIntent[]>()
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
            }

            for (let i = 1; i < bookings.length; i++) {
                const booking = bookings[i]

                // Check if consecutive booking for same room
                if (booking.roomId === current.roomId && booking.time === current.endTime) {
                    current.endTime = booking.time + 1
                } else {
                    combined.push(current)
                    current = {
                        roomId: booking.roomId,
                        date: new Date(booking.date),
                        startTime: booking.time,
                        endTime: booking.time + 1,
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
        <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                    {t('SELECTED_BOOKINGS_TITLE', { count: plannedBookings.length })}
                </h3>
                <Button variant="ghost" size="sm" onClick={onClearAll}>
                    <X className="h-4 w-4 mr-1" />
                    {t('CLEAR_ALL')}
                </Button>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
                {bookingsByDate.map((dateGroup, dateIndex) => (
                    <div key={dateIndex}>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                            {formatDate(dateGroup.date)}
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
    )
}
