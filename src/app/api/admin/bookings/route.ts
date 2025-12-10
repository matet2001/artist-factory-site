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
        const { name, bandName, note, bookings, userId } = body

        if (!name || !bookings || !Array.isArray(bookings) || bookings.length === 0) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        let user

        // If userId is provided, use existing user
        if (userId) {
            user = await prisma.user.findUnique({
                where: { id: userId },
            })

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }
        } else {
            // Create new user with placeholder email
            user = await prisma.user.upsert({
                where: { email: `${name.toLowerCase().replace(/\s+/g, '_')}@place.holder.com` },
                update: {
                    name,
                    bandName: bandName || null,
                },
                create: {
                    email: `${name.toLowerCase().replace(/\s+/g, '_')}@place.holder.com`,
                    name,
                    bandName: bandName || null,
                    password: '', // Phone bookings don't need passwords
                    emailVerified: new Date(), // Auto-verify phone bookings
                },
            })
        }

        // Create bookings sequentially to avoid race conditions
        const createdBookings = []
        for (const booking of bookings as { roomId: string; date: string; time: number }[]) {
            // Parse UTC date string (YYYY-MM-DD) and create UTC date at midnight
            // This prevents timezone conversion issues
            const bookingDate = new Date(booking.date + 'T00:00:00.000Z')

            // Check if slot is available
            const existing = await prisma.booking.findUnique({
                where: {
                    date_time_roomId: {
                        date: bookingDate,
                        time: booking.time,
                        roomId: booking.roomId,
                    },
                },
            })

            if (existing) {
                throw new Error(`Slot ${booking.roomId} at ${booking.time}:00 is already booked`)
            }

            // Get room to validate it exists
            const room = await prisma.room.findUnique({
                where: { id: booking.roomId },
            })

            if (!room) {
                throw new Error(`Room ${booking.roomId} not found`)
            }

            // Create the booking
            const created = await prisma.booking.create({
                data: {
                    userId: user.id,
                    roomId: booking.roomId,
                    date: bookingDate,
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

            createdBookings.push(created)
        }

        return NextResponse.json({ bookings: createdBookings }, { status: 201 })
    } catch (error) {
        console.error('Error creating admin booking:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create booking' },
            { status: 500 }
        )
    }
}
