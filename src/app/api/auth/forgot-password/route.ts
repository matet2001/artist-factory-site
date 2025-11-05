import { sendPasswordResetEmail } from '@/lib/email'
import { getLocaleForEmail } from '@/lib/email-local-helper'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists, a password reset email has been sent.',
            })
        }

        // Delete any existing password reset tokens for this email
        await prisma.verificationToken.deleteMany({
            where: {
                email,
                type: 'PASSWORD_RESET',
            },
        })

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex')
        await prisma.verificationToken.create({
            data: {
                email,
                token,
                expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
                type: 'PASSWORD_RESET',
            },
        })

        // Send reset email
        const locale = await getLocaleForEmail()

        await sendPasswordResetEmail(email, token, locale)

        return NextResponse.json({
            message: 'If an account exists, a password reset email has been sent.',
        })
    } catch (error) {
        console.error('Password reset request error:', error)
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }
}
