import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
        }

        // Find the reset token
        const resetToken = await prisma.verificationToken.findUnique({
            where: { token },
        })

        if (!resetToken) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
        }

        // Check if token is expired
        if (resetToken.expires < new Date()) {
            await prisma.verificationToken.delete({ where: { token } })
            return NextResponse.json({ error: 'Token has expired' }, { status: 400 })
        }

        // Check if it's the right type
        if (resetToken.type !== 'PASSWORD_RESET') {
            return NextResponse.json({ error: 'Invalid token type' }, { status: 400 })
        }

        // Update user's password
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
        })

        // Delete the token
        await prisma.verificationToken.delete({ where: { token } })

        return NextResponse.json({
            message: 'Password reset successfully',
        })
    } catch (error) {
        console.error('Password reset error:', error)
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }
}
