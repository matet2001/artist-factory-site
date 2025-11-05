import { sendVerificationEmail } from '@/lib/email'
import { getLocaleForEmail } from '@/lib/email-local-helper'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

/**
 * Calculate rate limit cooldown period with exponential backoff
 * @param emailSentCount - Number of emails sent in current period
 * @returns Cooldown period in seconds
 */
function calculateCooldown(emailSentCount: number): number {
    // Progressive cooldown: 60s, 120s, 300s (5min), 600s (10min), then 3600s (1hr)
    const cooldowns = [60, 120, 300, 600, 3600]
    return cooldowns[Math.min(emailSentCount, cooldowns.length - 1)]
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'ERRORS.INVALID_EMAIL' }, { status: 400 })
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (!user) {
            // Don't reveal if user exists or not for security
            return NextResponse.json(
                { message: 'RESEND_EMAIL_SUCCESS' },
                { status: 200 }
            )
        }

        // Check if already verified
        if (user.emailVerified) {
            return NextResponse.json(
                { error: 'ERRORS.EMAIL_ALREADY_VERIFIED' },
                { status: 400 }
            )
        }

        // Rate limiting check
        const now = new Date()
        if (user.lastEmailSent) {
            const cooldownPeriod = calculateCooldown(user.emailSentCount)
            const timeSinceLastEmail = (now.getTime() - user.lastEmailSent.getTime()) / 1000

            if (timeSinceLastEmail < cooldownPeriod) {
                const remainingSeconds = Math.ceil(cooldownPeriod - timeSinceLastEmail)
                return NextResponse.json(
                    {
                        error: 'RESEND_EMAIL_RATE_LIMIT',
                        remainingSeconds,
                    },
                    { status: 429 }
                )
            }
        }

        // Reset count if it's been over an hour since last email
        const hoursSinceLastEmail = user.lastEmailSent
            ? (now.getTime() - user.lastEmailSent.getTime()) / (1000 * 60 * 60)
            : 999
        const newEmailSentCount = hoursSinceLastEmail > 1 ? 1 : user.emailSentCount + 1

        // Delete old verification tokens for this email
        await prisma.verificationToken.deleteMany({
            where: {
                email: user.email,
                type: 'EMAIL_VERIFICATION',
            },
        })

        // Generate new verification token
        const token = crypto.randomBytes(32).toString('hex')
        await prisma.verificationToken.create({
            data: {
                email: user.email,
                token,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                type: 'EMAIL_VERIFICATION',
            },
        })

        // Update user's email tracking fields
        await prisma.user.update({
            where: { email: user.email },
            data: {
                lastEmailSent: now,
                emailSentCount: newEmailSentCount,
            },
        })

        // Get user's locale
        const locale = await getLocaleForEmail()

        // Send verification email
        await sendVerificationEmail(user.email, token, locale)

        return NextResponse.json({ message: 'RESEND_EMAIL_SUCCESS' }, { status: 200 })
    } catch (error) {
        console.error('Error resending verification email:', error)
        return NextResponse.json(
            { error: 'ERRORS.EMAIL_SEND_FAILED' },
            { status: 500 }
        )
    }
}
