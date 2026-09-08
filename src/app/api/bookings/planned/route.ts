import prisma from '@/lib/prisma'
import {
    PLANNED_HOLD_MINUTES,
    plannedHoldCutoff,
    plannedHoldExpiresAt,
} from '@/lib/booking-utils'
import { BookingStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../../../../auth'

/**
 * Every live cart hold belonging to the signed-in visitor, across all dates.
 *
 * The booking page used to derive this from the same 7-day window it renders,
 * so slots picked outside that window silently dropped out of the cart: they
 * were never sent to /confirm, never turned into a booking, and never made it
 * into the confirmation email — while the visitor was told the order succeeded.
 * The cart has to be a server fact, independent of what the grid is showing.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const bookings = await prisma.booking.findMany({
            where: {
                userId: session.user.id,
                status: BookingStatus.PLANNED,
                createdAt: { gt: plannedHoldCutoff() },
            },
            include: {
                user: {
                    select: { name: true, bandName: true },
                },
            },
            orderBy: [{ date: 'asc' }, { time: 'asc' }, { roomId: 'asc' }],
        })

        return NextResponse.json({
            success: true,
            holdMinutes: PLANNED_HOLD_MINUTES,
            bookings: bookings.map((booking) => ({
                id: booking.id,
                roomId: booking.roomId,
                time: booking.time,
                startMinute: booking.startMinute,
                endMinute: booking.endMinute,
                date: booking.date,
                status: booking.status,
                userId: booking.userId,
                createdAt: booking.createdAt.toISOString(),
                expiresAt: plannedHoldExpiresAt(booking.createdAt).toISOString(),
                user: {
                    fullName: booking.name || booking.user.name || '',
                    bandName: booking.bandName || booking.user.bandName || null,
                },
            })),
        })
    } catch (error) {
        console.error('Error fetching planned bookings:', error)
        return NextResponse.json({ error: 'Failed to fetch planned bookings' }, { status: 500 })
    }
}
