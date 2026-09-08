import { authOptions } from '@/../auth'
import { revalidateBookings } from '@/lib/booking-cache'
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
        const { id, expectedStatus } = body

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Booking id is required' }, { status: 400 })
        }

        const existing = await prisma.booking.findUnique({
            where: { id },
            include: { user: { select: { email: true, name: true } } },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // The table refreshes on a timer, so what the admin clicked may not be what
        // is in the row any more — a cart hold can turn into a confirmed booking
        // between the render and the click. Refuse rather than delete the wrong thing.
        if (expectedStatus && existing.status !== expectedStatus) {
            return NextResponse.json(
                {
                    error: 'BOOKING_CHANGED',
                    actualStatus: existing.status,
                },
                { status: 409 }
            )
        }

        const deleted = await prisma.booking.delete({ where: { id } })
        // The availability grid is served from cache — let it see this.
        revalidateBookings()


        console.log(
            `✓ Admin ${session.user.email} deleted ${existing.status} booking ${id} ` +
                `(${existing.roomId} ${existing.date.toISOString().split('T')[0]} ${existing.time}:00, ` +
                `customer: ${existing.name || existing.user.name || existing.user.email})`
        )

        return NextResponse.json({ success: true, booking: deleted }, { status: 200 })
    } catch (error) {
        console.error('Error deleting booking:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete booking' },
            { status: 500 }
        )
    }
}
