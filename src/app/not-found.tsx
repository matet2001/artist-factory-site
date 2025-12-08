import { routing } from '@/i18n/routing'
import { NotFoundClient } from './not-found-client'
import { headers } from 'next/headers'

// Hardcoded fallback translations (Hungarian as main language)
const fallbackTranslations = {
    hu: {
        title: 'Az oldal nem található',
        description: 'A keresett oldal nem létezik vagy át lett helyezve.',
        goHome: 'Vissza a főoldalra',
        goBooking: 'Foglalás leadása',
        redirectMessage: 'Átirányítás a főoldalra {seconds} másodperc múlva...',
    },
    en: {
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist or has been moved.",
        goHome: 'Go to Home',
        goBooking: 'Make a Booking',
        redirectMessage: 'Redirecting to home page in {seconds} seconds...',
    },
}

export default async function NotFound() {
    // Try to detect locale from the URL path or use default
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || headersList.get('referer') || ''

    // Extract locale from pathname if it exists
    let locale = routing.defaultLocale
    for (const l of routing.locales) {
        if (pathname.includes(`/${l}/`) || pathname.endsWith(`/${l}`)) {
            locale = l
            break
        }
    }

    // Use fallback translations
    const translations = fallbackTranslations[locale as keyof typeof fallbackTranslations] || fallbackTranslations.hu

    return (
        <NotFoundClient
            locale={locale}
            translations={translations}
        />
    )
}
