import { revalidateBookings } from '@/lib/booking-cache'
import prisma from '@/lib/prisma'
import { sendAdminBookingNotification, sendBookingConfirmationEmail } from '@/lib/email'
import { toDateKey } from '@/lib/booking-utils'
import { BookingStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../../../../auth'
import { getRoomPrice, rooms } from '@/lib/rooms'
import { getTranslations } from 'next-intl/server'

interface ConfirmedSlot {
    id: string
    roomId: string
    roomKey: string
    date: string
    time: number
    price: number
}

/** Merge back-to-back hours in the same room on the same day into one line. */
function combineSlots(slots: ConfirmedSlot[]) {
    const sorted = [...slots].sort(
        (a, b) =>
            a.date.localeCompare(b.date) || a.roomId.localeCompare(b.roomId) || a.time - b.time
    )

    const combined: Array<ConfirmedSlot & { startTime: number; endTime: number }> = []

    for (const slot of sorted) {
        const current = combined[combined.length - 1]
        const isConsecutive =
            current &&
            current.roomId === slot.roomId &&
            current.date === slot.date &&
            current.endTime === slot.time

        if (isConsecutive) {
            current.endTime = slot.time + 1
        } else {
            combined.push({ ...slot, startTime: slot.time, endTime: slot.time + 1 })
        }
    }

    return combined
}

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

        // Find all PLANNED bookings for this user with the specified IDs.
        // No hold-expiry filter on purpose: if the row still exists then nobody
        // else has taken the slot, and losing a real customer's booking is far
        // worse than honouring a cart that sat open a little too long.
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
                user: {
                    select: {
                        email: true,
                        name: true,
                    },
                },
            },
        })

        // Anything the visitor still had in their cart that is no longer holdable —
        // someone else claimed the slot after the hold lapsed. They must be told,
        // instead of getting a success dialog for a booking that does not exist.
        const confirmedIds = new Set(plannedBookings.map((b) => b.id))
        const missingIds = bookingIds.filter((id: string) => !confirmedIds.has(id))

        if (plannedBookings.length === 0) {
            return NextResponse.json(
                { error: 'No planned bookings found', missingIds },
                { status: 404 }
            )
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
                verifiedAt: new Date(),
            },
        })

        // Invalidate before the emails: a failed send must not leave the grid stale.
        revalidateBookings()

        // Get user email from the first booking (all bookings belong to the same user)
        const userEmail = plannedBookings[0].user.email
        const userName = plannedBookings[0].user.name || userEmail

        // Get user's locale from headers or default to 'hu'
        const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'hu'

        const slots: ConfirmedSlot[] = plannedBookings.map((b) => {
            const dateKey = toDateKey(b.date)
            const room = rooms.find((r) => r.id === b.roomId)
            return {
                id: b.id,
                roomId: b.roomId,
                roomKey: b.room.name,
                date: dateKey,
                time: b.time,
                // The rate that was valid for the rehearsal's own day, so an
                // October rise never lands on a September booking.
                price: room ? getRoomPrice(room, dateKey) : 0,
            }
        })

        // Send confirmation email to customer
        try {
            await sendBookingConfirmationEmail(
                userEmail,
                slots.map((s) => ({
                    roomId: s.roomId,
                    roomName: s.roomKey,
                    date: new Date(s.date).toLocaleDateString(locale === 'hu' ? 'hu-HU' : 'en-US'),
                    time: s.time,
                    price: s.price,
                })),
                locale
            )
        } catch (emailError) {
            console.error('Failed to send booking confirmation email:', emailError)
            // Note: We don't rollback since the booking is already confirmed
            // The user can still see their booking in the system
        }

        // Tell the office about it too. Without this the booking table is the only
        // record of an online booking, so anything that drops out of it is gone
        // without trace. The admin template is Hungarian-only, hence the fixed locale.
        try {
            const tRooms = await getTranslations({ locale: 'hu', namespace: 'ROOMS' })
            await sendAdminBookingNotification(
                combineSlots(slots).map((s) => ({
                    roomId: s.roomId,
                    roomName: tRooms(s.roomKey),
                    date: s.date,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    price: s.price,
                    bookingId: s.id,
                })),
                userName,
                userEmail
            )
        } catch (emailError) {
            console.error('Failed to send admin booking notification:', emailError)
        }

        return NextResponse.json({
            success: true,
            message: 'Bookings confirmed',
            bookingsCount: plannedBookings.length,
            missingIds,
        })
    } catch (error) {
        console.error('Error confirming bookings:', error)
        return NextResponse.json({ error: 'Failed to confirm bookings' }, { status: 500 })
    }
}
