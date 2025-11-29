import { authOptions } from '@/../auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is admin
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, bandName, note, bookings } = body

        if (!name || !bookings || !Array.isArray(bookings) || bookings.length === 0) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        // Create user if doesn't exist, or find existing
        const user = await prisma.user.upsert({
            where: { email: `phone_${name.toLowerCase().replace(/\s+/g, '_')}@artistfactory.local` },
            update: {
                name,
                bandName: bandName || null,
            },
            create: {
                email: `phone_${name.toLowerCase().replace(/\s+/g, '_')}@artistfactory.local`,
                name,
                bandName: bandName || null,
                password: '', // Phone bookings don't need passwords
                emailVerified: new Date(), // Auto-verify phone bookings
            },
        })

        // Create bookings
        const createdBookings = await Promise.all(
            bookings.map(async (booking: { roomId: string; date: string; time: number }) => {
                // Check if slot is available
                const existing = await prisma.booking.findUnique({
                    where: {
                        date_time_roomId: {
                            date: new Date(booking.date),
                            time: booking.time,
                            roomId: booking.roomId,
                        },
                    },
                })

                if (existing) {
                    throw new Error(`Slot ${booking.roomId} at ${booking.time}:00 is already booked`)
                }

                // Get room price
                const room = await prisma.room.findUnique({
                    where: { id: booking.roomId },
                })

                if (!room) {
                    throw new Error(`Room ${booking.roomId} not found`)
                }

                return prisma.booking.create({
                    data: {
                        userId: user.id,
                        roomId: booking.roomId,
                        date: new Date(booking.date),
                        time: booking.time,
                        status: 'VERIFIED', // Phone bookings are immediately verified
                        verifiedAt: new Date(),
                        note: note || null, // Add admin note if provided
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                bandName: true,
                            },
                        },
                    },
                })
            })
        )

        return NextResponse.json({ bookings: createdBookings }, { status: 201 })
    } catch (error) {
        console.error('Error creating admin booking:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create booking' },
            { status: 500 }
        )
    }
}
