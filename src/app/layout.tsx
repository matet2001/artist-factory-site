import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'

const sora = Sora({
    variable: '--font-sora',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    metadataBase: new URL('https://www.artistfactory.hu'),
    title: {
        default: 'Artist Factory - Próbaterem és Stúdió Budapest | Hangszigetelt Próbatermek 2007 óta',
        template: '%s | Artist Factory Budapest'
    },
    description: 'Próbaterem Budapest belvárosában! 5 hangszigetelt próbaterem és professzionális stúdió 2007 óta. Légkondicionált termek, prémium felszerelés, megfizethető árak. Foglalj online most!',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
    keywords: [
        'próbaterem',
        'próbaterem budapest',
        'próbaterem bérlés',
        'hangszigetelt próbaterem',
        'zenekari próbaterem',
        'próbaterem bérlet',
        'stúdió budapest',
        'hangstúdió',
        'zenekari próba',
        'zenekari terem',
        'próbaterem árak',
        'legkondicionált próbaterem',
        'budapest próbaterem',
        'próbaterem online foglalás',
        'Artist Factory',
        'rehearsal room budapest',
        'recording studio budapest',
        'band rehearsal',
        'music studio',
        'soundproof rehearsal room'
    ],
    authors: [{ name: 'Artist Factory' }],
    creator: 'Artist Factory',
    publisher: 'Artist Factory',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'hu_HU',
        alternateLocale: ['en_US'],
        url: 'https://www.artistfactory.hu',
        siteName: 'Artist Factory Budapest',
        title: 'Artist Factory - Próbaterem és Stúdió Budapest',
        description: 'Próbaterem Budapest belvárosában! 5 hangszigetelt próbaterem és professzionális stúdió 2007 óta. Légkondicionált termek, prémium felszerelés.',
        images: [
            {
                url: '/pictures/hero.jpg',
                width: 1200,
                height: 630,
                alt: 'Artist Factory próbaterem Budapest - hangszigetelt zenekari próbatermek'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Artist Factory - Próbaterem Budapest',
        description: 'Próbaterem bérlés Budapest belvárosában | 5 hangszigetelt terem | Stúdió | 2007 óta',
        images: ['/pictures/hero.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'add-your-google-verification-code-here',
    },
    alternates: {
        canonical: 'https://www.artistfactory.hu',
        languages: {
            'hu': 'https://www.artistfactory.hu/hu',
            'en': 'https://www.artistfactory.hu/en',
        },
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html className="overflow-x-hidden scroll-smooth">
            <body className={`${sora.variable} font-main antialiased text-foreground`}>
                {children}
                <Analytics />
            </body>
        </html>
    )
}
