import { authOptions } from '@/../auth'
import prisma from '@/lib/prisma'
import type { LookupUser } from '@/lib/similar-users'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

/**
 * Every customer, trimmed to what the phone-booking form needs to pick one.
 *
 * The paginated /api/admin/users only returns the newest 30, which is why
 * long-standing customers never showed up in the picker and got re-created
 * under a slightly different name instead.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const rows = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                bandName: true,
                phone: true,
                _count: { select: { bookings: true } },
            },
            orderBy: { name: 'asc' },
        })

        const users: LookupUser[] = rows.map(({ _count, ...u }) => ({
            ...u,
            bookingCount: _count.bookings,
        }))

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Error fetching user lookup:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}
