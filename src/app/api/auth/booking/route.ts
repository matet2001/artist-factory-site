import prisma from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token } = body

        if (!token) {
            return NextResponse.json({ error: 'Verification token is required' }, { status: 400 })
        }

        // Find the verification record
        const verification = await prisma.bookingVerification.findUnique({
            where: { token },
        })

        if (!verification) {
            return NextResponse.json({ error: 'Invalid verification token' }, { status: 404 })
        }

        // Check if already verified
        if (verification.status === 'verified') {
            return NextResponse.json(
                { error: 'This booking has already been verified' },
                { status: 400 }
            )
        }

        // Check if expired
        if (new Date() > verification.expiresAt) {
            await prisma.bookingVerification.update({
                where: { token },
                data: { status: 'expired' },
            })

            return NextResponse.json({ error: 'Verification link has expired' }, { status: 400 })
        }

        // Verify all bookings in a transaction
        await prisma.$transaction(async (tx) => {
            // Update verification status
            await tx.bookingVerification.update({
                where: { token },
                data: { status: 'verified' },
            })

            // Update all bookings to VERIFIED
            await tx.booking.updateMany({
                where: {
                    verificationToken: token,
                    status: BookingStatus.UNVERIFIED,
                },
                data: {
                    status: BookingStatus.VERIFIED,
                    verifiedAt: new Date(),
                },
            })
        })

        // Get the verified bookings
        const verifiedBookings = await prisma.booking.findMany({
            where: {
                verificationToken: token,
            },
            include: {
                room: true,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Booking successfully verified!',
            bookings: verifiedBookings,
        })
    } catch (error) {
        console.error('Error verifying booking:', error)
        return NextResponse.json({ error: 'Failed to verify booking' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date')

        if (!dateParam) {
            return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
        }

        // Parse the date and set time bounds for the day
        const selectedDate = new Date(dateParam)
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        // Fetch all bookings for the selected date
        const bookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                room: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [{ time: 'asc' }, { roomId: 'asc' }],
        })

        // Transform the data to match the BookingData interface
        const transformedBookings = bookings.map((booking) => ({
            id: booking.id,
            roomId: booking.roomId,
            time: booking.time,
            date: booking.date,
            status: booking.status,
            userId: booking.userId,
            user: booking.userId,
            room: booking.roomId,
        }))

        return NextResponse.json({
            success: true,
            bookings: transformedBookings,
            date: dateParam,
        })
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }
}
