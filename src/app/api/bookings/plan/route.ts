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
        const { date, time, roomId } = body

        if (!date || time === undefined || !roomId) {
            return NextResponse.json(
                { error: 'Missing required fields: date, time, roomId' },
                { status: 400 }
            )
        }

        // Parse and normalize the date
        const bookingDate = new Date(date)
        bookingDate.setHours(0, 0, 0, 0)

        // Check if the time slot is already booked
        const existingBooking = await prisma.booking.findUnique({
            where: {
                date_time_roomId: {
                    date: bookingDate,
                    time: time,
                    roomId: roomId,
                },
            },
        })

        if (existingBooking) {
            return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })
        }

        // Create a PLANNED booking
        const booking = await prisma.booking.create({
            data: {
                date: bookingDate,
                time: time,
                roomId: roomId,
                userId: session.user.id,
                status: BookingStatus.PLANNED,
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
                room: true,
            },
        })

        return NextResponse.json({
            success: true,
            booking: {
                id: booking.id,
                roomId: booking.roomId,
                time: booking.time,
                date: booking.date,
                status: booking.status,
                userId: booking.userId,
                user: {
                    fullName: booking.user.name || booking.user.email,
                    bandName: booking.user.bandName,
                },
            },
        })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const bookingId = searchParams.get('id')

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
        }

        // Find the booking and verify ownership
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        if (booking.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Unauthorized to delete this booking' },
                { status: 403 }
            )
        }

        if (booking.status !== BookingStatus.PLANNED) {
            return NextResponse.json(
                { error: 'Only planned bookings can be deleted' },
                { status: 400 }
            )
        }

        // Delete the booking
        await prisma.booking.delete({
            where: { id: bookingId },
        })

        return NextResponse.json({
            success: true,
            message: 'Booking deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting booking:', error)
        return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
    }
}
