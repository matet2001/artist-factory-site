import prisma from '@/lib/prisma'
import { sendAdminBookingNotification, sendBookingConfirmationEmail } from '@/lib/email'
import { BookingStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../../../../auth'
import { rooms } from '@/lib/rooms'
import { getTranslations } from 'next-intl/server'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { bookingIds } = body

        if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
            return NextResponse.json({ error: 'Booking IDs are required' }, { status: 400 })
        }

        // Find all PLANNED bookings for this user with the specified IDs
        const plannedBookings = await prisma.booking.findMany({
            where: {
                id: {
                    in: bookingIds,
                },
                userId: session.user.id,
                status: BookingStatus.PLANNED,
            },
            include: {
                room: true,
            },
        })

        if (plannedBookings.length === 0) {
            return NextResponse.json({ error: 'No planned bookings found' }, { status: 404 })
        }

        // Update all planned bookings to VERIFIED directly
        await prisma.booking.updateMany({
            where: {
                id: {
                    in: plannedBookings.map((b) => b.id),
                },
            },
            data: {
                status: BookingStatus.VERIFIED,
            },
        })

        // Get user email and locale
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { email: true },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get user's locale from headers or default to 'hu'
        const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'hu'

        // Format bookings for email with prices and room IDs
        const formattedBookings = plannedBookings.map((b) => {
            const room = rooms.find((r) => r.id === b.roomId)
            return {
                roomId: b.roomId,
                roomName: b.room.name,
                date: new Date(b.date).toLocaleDateString(locale === 'hu' ? 'hu-HU' : 'en-US'),
                time: b.time,
                price: room?.price || 0,
            }
        })

        // Send confirmation email to customer
        try {
            await sendBookingConfirmationEmail(user.email, formattedBookings, locale)
        } catch (emailError) {
            console.error('Failed to send booking confirmation email:', emailError)
            // Note: We don't rollback since the booking is already confirmed
            // The user can still see their booking in the system
        }

        return NextResponse.json({
            success: true,
            message: 'Bookings confirmed',
            bookingsCount: plannedBookings.length,
        })
    } catch (error) {
        console.error('Error confirming bookings:', error)
        return NextResponse.json({ error: 'Failed to confirm bookings' }, { status: 500 })
    }
}
