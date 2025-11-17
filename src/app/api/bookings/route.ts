import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date')

        if (!dateParam) {
            return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
        }

        // Parse the date and set time bounds for the day
        const selectedDate = new Date(dateParam)
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        // Fetch all bookings for the selected date
        const bookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
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
        const transformedBookings = bookings.map((booking) => ({
            id: booking.id,
            roomId: booking.roomId,
            time: booking.time,
            date: booking.date,
            status: booking.status,
            userId: booking.userId,
        }))

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
