import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Redirect old URLs (without locale) to new URLs (with /hu locale)
    // This handles URLs from Google's old index like /áraink, /booking, etc.
    const oldRoutes = [
        '/áraink',
        '/prices',
        '/booking',
        '/contact',
        '/studio',
        '/rooms',
        '/privacy-policy',
        '/terms-of-booking',
        '/login',
        '/register',
    ]

    // Check if pathname matches old routes (no locale prefix)
    const isOldRoute = oldRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
    const hasLocalePrefix = routing.locales.some((locale) => pathname.startsWith(`/${locale}`))

    if (isOldRoute && !hasLocalePrefix) {
        // Redirect to the same path with /hu prefix (default locale)
        const redirectUrl = new URL(`/${routing.defaultLocale}${pathname}`, request.url)
        return NextResponse.redirect(redirectUrl, 301) // 301 = Permanent redirect
    }

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
    const response = intlMiddleware(request)

    // Add pathname header for not-found page locale detection
    if (response) {
        response.headers.set('x-pathname', pathname)
    }

    return response
}

export const config = {
    // Match only internationalized pathnames
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
