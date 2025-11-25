import prisma from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../../../../auth'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { bookingId } = body

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
        }

        // Find the booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Check if booking belongs to the user
        if (booking.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Check if booking is VERIFIED
        if (booking.status !== BookingStatus.VERIFIED) {
            return NextResponse.json(
                { error: 'Only verified bookings can be cancelled' },
                { status: 400 }
            )
        }

        // Check if booking is at least 48 hours in the future
        const now = new Date()
        const bookingDateTime = new Date(booking.date)
        bookingDateTime.setHours(booking.time, 0, 0, 0)

        const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

        if (hoursUntilBooking < 48) {
            return NextResponse.json(
                {
                    error: 'Bookings can only be cancelled online at least 48 hours in advance. Please contact us by phone or email.',
                },
                { status: 400 }
            )
        }

        // Delete the booking
        await prisma.booking.delete({
            where: { id: bookingId },
        })

        return NextResponse.json({
            success: true,
            message: 'Booking cancelled successfully',
        })
    } catch (error) {
        console.error('Error cancelling booking:', error)
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
    }
}
