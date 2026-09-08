import { getBookingsInRange } from '@/lib/booking-cache'
import { plannedHoldExpiresAt } from '@/lib/booking-utils'
import { BookingStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date')
        const startDateParam = searchParams.get('startDate')
        const endDateParam = searchParams.get('endDate')

        let startOfRange: Date
        let endOfRange: Date

        // Support both single date and date range queries
        if (startDateParam && endDateParam) {
            // Date range query (for admin)
            startOfRange = new Date(startDateParam + 'T00:00:00.000Z')
            endOfRange = new Date(endDateParam + 'T23:59:59.999Z')
        } else if (dateParam) {
            // Single date query (for regular booking page)
            startOfRange = new Date(dateParam + 'T00:00:00.000Z')
            endOfRange = new Date(dateParam + 'T23:59:59.999Z')
        } else {
            return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
        }

        // Read is cached and invalidated by writes, so the 60-second poll from the
        // admin grid no longer wakes the database. Lapsed cart holds are dropped
        // inside this call, against the current time rather than the cached copy.
        const bookings = await getBookingsInRange(
            startOfRange.toISOString(),
            endOfRange.toISOString()
        )

        // Transform the data to match the BookingData interface
        const transformedBookings = bookings.map((booking) => {
            const userData = {
                fullName: booking.name || booking.user.name || '',
                bandName: booking.bandName || booking.user.bandName || null,
            }

            return {
                id: booking.id,
                roomId: booking.roomId,
                time: booking.time,
                startMinute: booking.startMinute,
                endMinute: booking.endMinute,
                date: booking.date,
                status: booking.status,
                userId: booking.userId,
                note: booking.note,
                createdAt: booking.createdAt,
                expiresAt:
                    booking.status === BookingStatus.PLANNED
                        ? plannedHoldExpiresAt(booking.createdAt).toISOString()
                        : undefined,
                user: userData,
            }
        })

        return NextResponse.json({
            success: true,
            bookings: transformedBookings,
            date: dateParam,
        })
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }
}
