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

        // Find the booking verification record
        const bookingVerification = await prisma.bookingVerification.findUnique({
            where: { token },
        })

        if (!bookingVerification) {
            return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 404 })
        }

        // Check if already verified
        if (bookingVerification.status === 'verified') {
            return NextResponse.json(
                { error: 'This booking has already been verified' },
                { status: 400 }
            )
        }

        // Check if expired
        if (new Date() > bookingVerification.expiresAt) {
            await prisma.bookingVerification.update({
                where: { id: bookingVerification.id },
                data: { status: 'expired' },
            })
            return NextResponse.json(
                { error: 'This verification link has expired. Please create a new booking.' },
                { status: 400 }
            )
        }

        // Get all bookings with this verification token
        const bookings = await prisma.booking.findMany({
            where: {
                verificationToken: token,
                status: BookingStatus.UNVERIFIED,
            },
            include: {
                room: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        })

        if (bookings.length === 0) {
            return NextResponse.json(
                { error: 'No bookings found for this verification token' },
                { status: 404 }
            )
        }

        // Update all bookings to VERIFIED
        await prisma.booking.updateMany({
            where: {
                verificationToken: token,
                status: BookingStatus.UNVERIFIED,
            },
            data: {
                status: BookingStatus.VERIFIED,
                verifiedAt: new Date(),
            },
        })

        // Update booking verification status
        await prisma.bookingVerification.update({
            where: { id: bookingVerification.id },
            data: { status: 'verified' },
        })

        return NextResponse.json({
            success: true,
            message: 'Your bookings have been successfully verified!',
            bookings: bookings.map((b) => ({
                id: b.id,
                roomId: b.roomId,
                roomName: b.room.name,
                time: b.time,
                date: b.date,
            })),
        })
    } catch (error) {
        console.error('Error verifying bookings:', error)
        return NextResponse.json({ error: 'Failed to verify bookings' }, { status: 500 })
    }
}
