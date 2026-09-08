import prisma from '@/lib/prisma'
import { plannedHoldCutoff } from '@/lib/booking-utils'
import { BookingStatus } from '@prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

/**
 * Everything that feeds the availability grid hangs off this one tag.
 *
 * Neon bills compute time, not queries, and the compute only sleeps after five
 * minutes with no traffic. The admin grid polls every 60 seconds, so before this
 * cache existed the database was pinned awake for the whole working day
 * answering the same question hundreds of times over. Bookings change a handful
 * of times a day, so the read is cached and the writes invalidate it — the poll
 * stays at 60 seconds and staff see a new booking exactly as fast as before.
 *
 * The rule for anything added later: if it writes to `booking`, or to a `user`
 * field the grid renders, call `revalidateBookings()` after the write succeeds.
 */
export const BOOKINGS_CACHE_TAG = 'bookings'

/**
 * Backstop only. Correctness comes from `revalidateBookings()` on every write;
 * this just bounds how long a grid could stay stale if a future write path
 * forgets to call it. Keep it long — a short value would wake the compute on a
 * timer and hand back the bill this cache exists to avoid.
 */
const CACHE_BACKSTOP_SECONDS = 60 * 60

/**
 * A booking as the availability grid needs it.
 *
 * The shape is deliberately narrower than the Prisma row: the cache round-trips
 * through JSON, so `Date`s cannot survive it and are stored as ISO strings, and
 * anything the response does not render (the room join, the user's id and
 * email) is left in the database rather than carried through the cache.
 */
export interface CachedBooking {
    id: string
    roomId: string
    time: number
    startMinute: number
    endMinute: number
    date: string
    status: BookingStatus
    userId: string
    name: string | null
    bandName: string | null
    note: string | null
    createdAt: string
    user: {
        name: string | null
        bandName: string | null
    }
}

/**
 * The cached half: a plain date-range read with no dependency on the clock, so
 * the same arguments always describe the same rows and the entry stays valid
 * until a write invalidates it.
 */
const readBookingsInRange = unstable_cache(
    async (startISO: string, endISO: string): Promise<CachedBooking[]> => {
        const bookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: new Date(startISO),
                    lte: new Date(endISO),
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                        bandName: true,
                    },
                },
            },
            orderBy: [{ time: 'asc' }, { roomId: 'asc' }],
        })

        return bookings.map((booking) => ({
            id: booking.id,
            roomId: booking.roomId,
            time: booking.time,
            startMinute: booking.startMinute,
            endMinute: booking.endMinute,
            date: booking.date.toISOString(),
            status: booking.status,
            userId: booking.userId,
            name: booking.name,
            bandName: booking.bandName,
            note: booking.note,
            createdAt: booking.createdAt.toISOString(),
            user: {
                name: booking.user.name,
                bandName: booking.user.bandName,
            },
        }))
    },
    ['bookings-in-range'],
    { tags: [BOOKINGS_CACHE_TAG], revalidate: CACHE_BACKSTOP_SECONDS }
)

/**
 * Bookings for a date range, with lapsed cart holds already dropped.
 *
 * The hold filter runs per request rather than inside the cached read on
 * purpose: "has this hold lapsed?" is a question about the current time, and
 * caching a time-dependent answer would leave an abandoned cart sitting in the
 * grid as an occupied slot until the next unrelated write happened to come
 * along. Splitting it this way keeps the expensive part cacheable and the
 * time-sensitive part exact.
 */
export async function getBookingsInRange(
    startISO: string,
    endISO: string,
    now: Date = new Date()
): Promise<CachedBooking[]> {
    const bookings = await readBookingsInRange(startISO, endISO)
    const holdCutoff = plannedHoldCutoff(now).getTime()

    return bookings.filter(
        (booking) =>
            booking.status !== BookingStatus.PLANNED ||
            new Date(booking.createdAt).getTime() > holdCutoff
    )
}

/** Call after any write that changes what the availability grid should show. */
export function revalidateBookings(): void {
    revalidateTag(BOOKINGS_CACHE_TAG)
}
