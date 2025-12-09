import { authOptions } from '@/../auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is admin
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { roomId, date, time } = body

        if (!roomId || !date || time === undefined) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        // Parse UTC date string (YYYY-MM-DD) to prevent timezone conversion issues
        const bookingDate = new Date(date + 'T00:00:00.000Z')

        // First check if booking exists
        const existing = await prisma.booking.findUnique({
            where: {
                date_time_roomId: {
                    date: bookingDate,
                    time,
                    roomId,
                },
            },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Delete the booking
        const deleted = await prisma.booking.delete({
            where: {
                date_time_roomId: {
                    date: bookingDate,
                    time,
                    roomId,
                },
            },
        })

        return NextResponse.json({ success: true, booking: deleted }, { status: 200 })
    } catch (error) {
        console.error('Error deleting booking:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete booking' },
            { status: 500 }
        )
    }
}
