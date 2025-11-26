import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the request is for an admin route
    const isAdminRoute = pathname.includes('/admin')

    if (isAdminRoute) {
        // Get the user's session token
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        // If no token or user is not an admin, redirect to home
        if (!token || !token.isAdmin) {
            const locale = request.nextUrl.pathname.split('/')[1]
            const redirectUrl = new URL(`/${locale}`, request.url)
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Run the intl middleware
    return intlMiddleware(request)
}

export const config = {
    // Match only internationalized pathnames
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
