// app/api/auth/verify-email/route.ts
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(new URL('/email-verified?success=false', request.url))
    }

    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    })

    if (!verificationToken) {
        return NextResponse.redirect(new URL('/email-verified?success=false', request.url))
    }

    if (verificationToken.expires < new Date()) {
        await prisma.verificationToken.delete({ where: { token } })
        return NextResponse.redirect(new URL('/email-verified?success=false', request.url))
    }

    if (verificationToken.type !== 'EMAIL_VERIFICATION') {
        return NextResponse.redirect(new URL('/email-verified?success=false', request.url))
    }

    await prisma.user.update({
        where: { email: verificationToken.email },
        data: { emailVerified: new Date() },
    })

    await prisma.verificationToken.delete({ where: { token } })

    return NextResponse.redirect(new URL('/email-verified?success=true', request.url))
}
