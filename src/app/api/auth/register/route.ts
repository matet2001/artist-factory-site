import { sendVerificationEmail } from '@/lib/email'
import { getLocaleForEmail } from '@/lib/email-local-helper'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name, phone, bandName } = body

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: 'ERRORS.INVALID_CREDENTIALS' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'ERRORS.WEAK_PASSWORD' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'ERRORS.EMAIL_ALREADY_EXISTS' },
                { status: 400 }
            )
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                name: name || email,
                email,
                password: hashedPassword,
                phone: phone || null,
                bandName: bandName || null,
                lastEmailSent: new Date(),
                emailSentCount: 1,
            },
        })

        // Generate verification token
        const token = crypto.randomBytes(32).toString('hex')
        await prisma.verificationToken.create({
            data: {
                email: newUser.email,
                token,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                type: 'EMAIL_VERIFICATION',
            },
        })

        // Send verification email
        try {
            const locale = await getLocaleForEmail()
            await sendVerificationEmail(newUser.email, token, locale)
        } catch {
            console.error('✗ Registration failed - email send error')
            // Delete user and token if email fails
            await prisma.verificationToken.deleteMany({
                where: { email: newUser.email },
            })
            await prisma.user.delete({
                where: { id: newUser.id },
            })
            return NextResponse.json(
                { error: 'ERRORS.EMAIL_SEND_FAILED' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: 'REGISTRATION_SUCCESS',
            email: newUser.email,
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'ERRORS.REGISTRATION_FAILED' },
            { status: 500 }
        )
    }
}
