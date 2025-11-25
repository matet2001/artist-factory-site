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
        const { date } = body

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 })
        }

        // Parse UTC date string and create UTC date at midnight
        const bookingDate = new Date(date + 'T00:00:00.000Z')

        // Find all PLANNED bookings for this user on this date
        const plannedBookings = await prisma.booking.findMany({
            where: {
                userId: session.user.id,
                date: bookingDate,
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
                date: bookingDate.toLocaleDateString(locale === 'hu' ? 'hu-HU' : 'en-US'),
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

        // Send notification email to admin with combined bookings
        try {
            // Get Hungarian translations for room names
            const tRooms = await getTranslations({ locale: 'hu', namespace: 'ROOMS' })

            // Combine consecutive bookings for admin notification
            const sortedBookings = [...plannedBookings].sort((a, b) => {
                if (a.roomId !== b.roomId) return a.roomId.localeCompare(b.roomId)
                return a.time - b.time
            })

            interface CombinedBooking {
                roomId: string
                roomName: string
                date: string
                startTime: number
                endTime: number
                price: number
                bookingId: string
            }

            const combinedBookings: CombinedBooking[] = []
            if (sortedBookings.length > 0) {
                let current: CombinedBooking = {
                    roomId: sortedBookings[0].roomId,
                    roomName: tRooms(sortedBookings[0].room.name),
                    date: bookingDate.toLocaleDateString('hu-HU'),
                    startTime: sortedBookings[0].time,
                    endTime: sortedBookings[0].time + 1,
                    price: rooms.find((r) => r.id === sortedBookings[0].roomId)?.price || 0,
                    bookingId: sortedBookings[0].id,
                }

                for (let i = 1; i < sortedBookings.length; i++) {
                    const booking = sortedBookings[i]
                    // Check if consecutive
                    if (booking.roomId === current.roomId && booking.time === current.endTime) {
                        current.endTime = booking.time + 1
                    } else {
                        combinedBookings.push(current)
                        current = {
                            roomId: booking.roomId,
                            roomName: tRooms(booking.room.name),
                            date: bookingDate.toLocaleDateString('hu-HU'),
                            startTime: booking.time,
                            endTime: booking.time + 1,
                            price: rooms.find((r) => r.id === booking.roomId)?.price || 0,
                            bookingId: booking.id,
                        }
                    }
                }
                combinedBookings.push(current)
            }

            await sendAdminBookingNotification(combinedBookings)
        } catch (emailError) {
            console.error('Failed to send admin notification email:', emailError)
            // Don't fail the request if admin notification fails
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
