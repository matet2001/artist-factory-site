import prisma from '@/lib/prisma'
import { sendBookingVerificationEmail } from '@/lib/email'
import { BookingStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/auth'
import { randomBytes } from 'crypto'

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

        // Parse and normalize the date
        const bookingDate = new Date(date)
        bookingDate.setHours(0, 0, 0, 0)

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

        // Generate a verification token
        const verificationToken = randomBytes(32).toString('hex')

        // Create booking verification record
        const bookingVerification = await prisma.bookingVerification.create({
            data: {
                token: verificationToken,
                userId: session.user.id,
                date: bookingDate,
                bookings: plannedBookings.map((b) => ({
                    id: b.id,
                    roomId: b.roomId,
                    time: b.time,
                })),
                status: 'pending',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        })

        // Update all planned bookings to UNVERIFIED and attach the verification token
        await prisma.booking.updateMany({
            where: {
                id: {
                    in: plannedBookings.map((b) => b.id),
                },
            },
            data: {
                status: BookingStatus.UNVERIFIED,
                verificationToken: verificationToken,
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

        // Format bookings for email
        const formattedBookings = plannedBookings.map((b) => ({
            roomName: b.room.name,
            date: bookingDate.toLocaleDateString(locale === 'hu' ? 'hu-HU' : 'en-US'),
            time: b.time,
        }))

        // Send verification email
        try {
            await sendBookingVerificationEmail(
                user.email,
                verificationToken,
                formattedBookings,
                locale
            )
        } catch (emailError) {
            console.error('Failed to send booking verification email:', emailError)
            // Rollback: delete verification and revert bookings to PLANNED
            await prisma.bookingVerification.delete({
                where: { id: bookingVerification.id },
            })
            await prisma.booking.updateMany({
                where: {
                    id: {
                        in: plannedBookings.map((b) => b.id),
                    },
                },
                data: {
                    status: BookingStatus.PLANNED,
                    verificationToken: null,
                },
            })
            return NextResponse.json(
                { error: 'Failed to send verification email' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Verification email sent',
            bookingsCount: plannedBookings.length,
        })
    } catch (error) {
        console.error('Error confirming bookings:', error)
        return NextResponse.json({ error: 'Failed to confirm bookings' }, { status: 500 })
    }
}
