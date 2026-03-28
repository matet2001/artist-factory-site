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

        // Use transaction to ensure all bookings are created or none at all
        const createdBookings = await prisma.$transaction(async (tx) => {
            let user

            // If userId is provided, use existing user
            if (userId) {
                user = await tx.user.findUnique({
                    where: { id: userId },
                })

                if (!user) {
                    throw new Error('User not found')
                }
            } else {
                // Create new user with placeholder email
                user = await tx.user.upsert({
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

            // Create bookings sequentially within transaction
            const results = []
            for (const booking of bookings as {
                roomId: string
                date: string
                time: number
                startMinute?: number
                endMinute?: number
            }[]) {
                // Parse UTC date string (YYYY-MM-DD) and create UTC date at midnight
                // This prevents timezone conversion issues
                const bookingDate = new Date(booking.date + 'T00:00:00.000Z')

                // Check if slot is available
                const existing = await tx.booking.findUnique({
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
                const room = await tx.room.findUnique({
                    where: { id: booking.roomId },
                })

                if (!room) {
                    throw new Error(`Room ${booking.roomId} not found`)
                }

                // Create the booking
                const created = await tx.booking.create({
                    data: {
                        userId: user.id,
                        roomId: booking.roomId,
                        date: bookingDate,
                        time: booking.time,
                        startMinute: booking.startMinute ?? 0,
                        endMinute: booking.endMinute ?? 0,
                        status: 'VERIFIED', // Phone bookings are immediately verified
                        verifiedAt: new Date(),
                        note: note || null, // Add admin note if provided
                        name: name, // Store name on the booking itself
                        bandName: bandName || null,
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

                results.push(created)
            }

            return results
        })

        return NextResponse.json({ bookings: createdBookings }, { status: 201 })
    } catch (error) {
        console.error('Error creating admin booking:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create booking' },
            { status: 500 }
        )
    }
}
