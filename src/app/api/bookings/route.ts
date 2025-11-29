import prisma from '@/lib/prisma'
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

        // Fetch all bookings for the date range
        const bookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: startOfRange,
                    lte: endOfRange,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        bandName: true,
                    },
                },
                room: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: [{ time: 'asc' }, { roomId: 'asc' }],
        })

        // Transform the data to match the BookingData interface
        const transformedBookings = bookings.map((booking) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bookingWithUser = booking as any
            const userData = bookingWithUser.user
                ? {
                      fullName: bookingWithUser.user.name || '',
                      bandName: bookingWithUser.user.bandName || null,
                  }
                : undefined

            return {
                id: booking.id,
                roomId: booking.roomId,
                time: booking.time,
                date: booking.date,
                status: booking.status,
                userId: booking.userId,
                note: booking.note,
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
