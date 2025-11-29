import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../../../../../auth'

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is authenticated and is admin
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { isAdmin: true },
        })

        if (!user?.isAdmin) {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            )
        }

        const body = await req.json()
        const { id, name, bandName, note } = body

        if (!id || !name) {
            return NextResponse.json(
                { error: 'Missing required fields: id, name' },
                { status: 400 }
            )
        }

        // Update the booking
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                note: note || null,
                user: {
                    update: {
                        name: name,
                        bandName: bandName || null,
                    },
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
        })

        return NextResponse.json({ booking: updatedBooking }, { status: 200 })
    } catch (error) {
        console.error('Error updating booking:', error)
        return NextResponse.json(
            {
                error: 'Failed to update booking',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
