import { revalidateBookings } from '@/lib/booking-cache'
import prisma from '@/lib/prisma'
import { PLANNED_DELETE_AFTER_MINUTES, plannedDeleteCutoff } from '@/lib/booking-utils'
import { BookingStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Deletes cart holds that were never confirmed.
 *
 * The slot itself is already free after PLANNED_HOLD_MINUTES — this only clears
 * the rows out so the table and the exports stay honest. Nothing else in the app
 * deletes them, which is how abandoned carts piled up as permanent yellow cells.
 */
export async function GET(request: NextRequest) {
    const secret = process.env.CRON_SECRET

    if (!secret) {
        console.error('CRON_SECRET is not set — refusing to run the cleanup job')
        return NextResponse.json({ error: 'Not configured' }, { status: 503 })
    }

    // Vercel Cron sends the secret as a bearer token.
    const authorized = request.headers.get('authorization') === `Bearer ${secret}`

    if (!authorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const cutoff = plannedDeleteCutoff()

        const stale = await prisma.booking.findMany({
            where: {
                status: BookingStatus.PLANNED,
                createdAt: { lte: cutoff },
            },
            select: { id: true, date: true, time: true, roomId: true, userId: true },
        })

        if (stale.length === 0) {
            return NextResponse.json({ success: true, deleted: 0 })
        }

        const result = await prisma.booking.deleteMany({
            where: { id: { in: stale.map((b) => b.id) } },
        })
        // The availability grid is served from cache — let it see this.
        revalidateBookings()


        console.log(
            `✓ Cleaned up ${result.count} abandoned cart hold(s) older than ` +
                `${PLANNED_DELETE_AFTER_MINUTES} minutes`
        )

        return NextResponse.json({ success: true, deleted: result.count })
    } catch (error) {
        console.error('Error cleaning up planned bookings:', error)
        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
    }
}
