import { authOptions } from '@/../auth'
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
        const { roomId, date, time } = body

        if (!roomId || !date || time === undefined) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        // Delete the booking
        const deleted = await prisma.booking.delete({
            where: {
                date_time_roomId: {
                    date: new Date(date),
                    time,
                    roomId,
                },
            },
        })

        return NextResponse.json({ success: true, booking: deleted }, { status: 200 })
    } catch (error) {
        console.error('Error deleting booking:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete booking' },
            { status: 500 }
        )
    }
}
