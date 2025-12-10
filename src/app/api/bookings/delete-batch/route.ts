import { authOptions } from '@/../auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { bookingIds } = body

        if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request: bookingIds array required' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Verify all bookings belong to the user and are VERIFIED
        const bookings = await prisma.booking.findMany({
            where: {
                id: { in: bookingIds },
            },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                        bandName: true,
                    },
                },
                room: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        // Check if all bookings exist
        if (bookings.length !== bookingIds.length) {
            return NextResponse.json({ error: 'Some bookings not found' }, { status: 404 })
        }

        // Check if all bookings belong to the user
        const allBelongToUser = bookings.every((b) => b.userId === user.id)
        if (!allBelongToUser) {
            return NextResponse.json(
                { error: 'You can only delete your own bookings' },
                { status: 403 }
            )
        }

        // Check if all bookings are VERIFIED (only verified bookings can be cancelled with email)
        const allVerified = bookings.every((b) => b.status === 'VERIFIED')
        if (!allVerified) {
            return NextResponse.json(
                { error: 'Only verified bookings can be cancelled this way' },
                { status: 400 }
            )
        }

        // Check 48-hour cancellation requirement for all bookings
        const now = new Date()
        for (const booking of bookings) {
            const bookingDateTime = new Date(booking.date)
            bookingDateTime.setHours(booking.time, 0, 0, 0)
            const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

            if (hoursUntilBooking < 48) {
                return NextResponse.json(
                    {
                        error: 'All bookings must be cancelled at least 48 hours in advance',
                    },
                    { status: 400 }
                )
            }
        }

        // Delete all bookings
        await prisma.booking.deleteMany({
            where: {
                id: { in: bookingIds },
            },
        })

        // TODO: Send cancellation email to user
        // This is where you would send ONE email with all the cancelled bookings
        // For now, we'll just log it
        console.log(`Cancelled ${bookings.length} bookings for user ${user.email}`)

        return NextResponse.json(
            {
                success: true,
                message: `Successfully cancelled ${bookings.length} booking(s)`,
                deletedCount: bookings.length,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting bookings in batch:', error)
        return NextResponse.json(
            {
                error: 'Failed to delete bookings',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
