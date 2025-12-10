import { authOptions } from '@/../auth'
import prisma from '@/lib/prisma'
import { sendAdminCancellationNotification, sendBookingCancellationEmail } from '@/lib/email'
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

        // Get locale from request headers or default to 'hu'
        const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'hu'

        // Send cancellation email to user
        try {
            await sendBookingCancellationEmail(
                user.email,
                bookings.map((b) => ({
                    roomId: b.room.name,
                    roomName: b.room.name,
                    date: b.date.toISOString().split('T')[0],
                    time: b.time,
                })),
                locale
            )
        } catch (error) {
            console.error('Failed to send user cancellation email:', error)
            // Don't fail the request if email fails
        }

        // Prepare bookings for admin notification (combine consecutive bookings)
        interface CombinedBooking {
            roomId: string
            roomName: string
            date: string
            startTime: number
            endTime: number
            bookingId: string
        }

        const combineBookingsForAdmin = (): CombinedBooking[] => {
            // Sort bookings by room and time
            const sorted = [...bookings].sort((a, b) => {
                if (a.room.name !== b.room.name) return a.room.name.localeCompare(b.room.name)
                return a.time - b.time
            })

            const combined: CombinedBooking[] = []
            let current: CombinedBooking = {
                roomId: sorted[0].room.name,
                roomName: sorted[0].room.name,
                date: sorted[0].date.toISOString().split('T')[0],
                startTime: sorted[0].time,
                endTime: sorted[0].time + 1,
                bookingId: sorted[0].id,
            }

            for (let i = 1; i < sorted.length; i++) {
                const booking = sorted[i]

                // Check if this booking is consecutive to the current one
                if (booking.room.name === current.roomName && booking.time === current.endTime) {
                    // Extend the current combined booking
                    current.endTime = booking.time + 1
                } else {
                    // Save the current combined booking and start a new one
                    combined.push(current)
                    current = {
                        roomId: booking.room.name,
                        roomName: booking.room.name,
                        date: booking.date.toISOString().split('T')[0],
                        startTime: booking.time,
                        endTime: booking.time + 1,
                        bookingId: booking.id,
                    }
                }
            }

            // Add the last combined booking
            combined.push(current)
            return combined
        }

        // Send cancellation notification to admin
        try {
            await sendAdminCancellationNotification(
                user.name || user.email,
                user.email,
                combineBookingsForAdmin(),
                locale
            )
        } catch (error) {
            console.error('Failed to send admin cancellation notification:', error)
            // Don't fail the request if admin email fails
        }

        console.log(`✓ Cancelled ${bookings.length} bookings for user ${user.email}`)

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
