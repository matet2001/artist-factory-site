import { revalidateBookings } from '@/lib/booking-cache'
import prisma from '@/lib/prisma'
import { plannedHoldCutoff, plannedHoldExpiresAt } from '@/lib/booking-utils'
import { BookingStatus, Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../../../../auth'

class SlotTakenError extends Error {
    constructor() {
        super('This time slot is already booked')
        this.name = 'SlotTakenError'
    }
}

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

        // Parse UTC date string (YYYY-MM-DD) and create UTC date at midnight
        const bookingDate = new Date(date + 'T00:00:00.000Z')
        const holdCutoff = plannedHoldCutoff()

        const booking = await prisma.$transaction(async (tx) => {
            const existingBooking = await tx.booking.findUnique({
                where: {
                    date_time_roomId: {
                        date: bookingDate,
                        time: time,
                        roomId: roomId,
                    },
                },
            })

            if (existingBooking) {
                const isLapsedHold =
                    existingBooking.status === BookingStatus.PLANNED &&
                    existingBooking.createdAt <= holdCutoff

                // A lapsed cart hold no longer owns the slot — reclaim it. Anything
                // else (a confirmed booking, or someone else's live hold) blocks.
                if (!isLapsedHold) {
                    throw new SlotTakenError()
                }

                await tx.booking.delete({ where: { id: existingBooking.id } })
            }

            return tx.booking.create({
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
        })

        // The availability grid is served from cache — let it see this.
        revalidateBookings()

        return NextResponse.json({
            success: true,
            booking: {
                id: booking.id,
                roomId: booking.roomId,
                time: booking.time,
                date: booking.date,
                status: booking.status,
                userId: booking.userId,
                createdAt: booking.createdAt.toISOString(),
                expiresAt: plannedHoldExpiresAt(booking.createdAt).toISOString(),
                user: {
                    fullName: booking.user.name || booking.user.email,
                    bandName: booking.user.bandName,
                },
            },
        })
    } catch (error) {
        // Either we saw a live booking, or another request won the race to create
        // one between our check and our insert. Both mean the same thing.
        if (
            error instanceof SlotTakenError ||
            (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        ) {
            return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })
        }

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

        // The availability grid is served from cache — let it see this.
        revalidateBookings()

        return NextResponse.json({
            success: true,
            message: 'Booking deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting booking:', error)
        return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
    }
}
