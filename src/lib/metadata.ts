import { Metadata } from 'next'

export interface PageMetadataParams {
    locale: string
    title: string
    description: string
    keywords?: string[]
    path?: string
    image?: string
}

export function generatePageMetadata({
    locale,
    title,
    description,
    keywords = [],
    path = '',
    image = '/pictures/hero.jpg',
}: PageMetadataParams): Metadata {
    const baseUrl = 'https://www.artistfactory.hu'
    const url = `${baseUrl}/${locale}${path}`

    const defaultKeywords = [
        'próbaterem',
        'próbaterem budapest',
        'Artist Factory',
        locale === 'hu' ? 'hangszigetelt próbaterem' : 'rehearsal room budapest',
    ]

    return {
        title,
        description,
        keywords: [...defaultKeywords, ...keywords],
        openGraph: {
            title,
            description,
            url,
            siteName: 'Artist Factory Budapest',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: locale === 'hu' ? 'hu_HU' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
        alternates: {
            canonical: url,
            languages: {
                hu: `${baseUrl}/hu${path}`,
                en: `${baseUrl}/en${path}`,
            },
        },
    }
}

export const pageMetadata = {
    hu: {
        home: {
            title: 'Artist Factory - Próbaterem Budapest | Hangszigetelt Próbatermek & Stúdió',
            description:
                'Próbaterem Budapest belvárosában! 5 hangszigetelt, légkondicionált próbaterem és professzionális stúdió 2007 óta. Prémium felszerelés, online foglalás. Foglalj most!',
            keywords: [
                'zenekari próbaterem',
                'próbaterem online foglalás',
                'próbaterem árak',
                'stúdió budapest',
                'légkondicionált próbaterem',
                'próbaterem bérlés budapest',
                'hangszigetelt terem',
                'zenekari terem',
            ],
        },
        prices: {
            title: 'Árak - Próbaterem Bérlés | Artist Factory Budapest',
            description:
                'Próbaterem árak Budapest belvárosában 5500 Ft/óra-tól. Zenekari próba, egyéni gyakorlás, last minute akciók. Légkondicionált termek prémium felszereléssel.',
            keywords: [
                'próbaterem árak',
                'próbaterem bérlés ár',
                'zenekari próba ár',
                'próbaterem óradíj',
                'stúdió árak budapest',
                'kedvező próbaterem',
                'olcsó próbaterem',
            ],
        },
        contact: {
            title: 'Kapcsolat - Elérhetőség & Térkép | Artist Factory Budapest',
            description:
                'Artist Factory próbaterem elérhetősége: Pozsonyi út 13, Budapest 1137. Telefon: +36-30-655-8488. Nyitva: 9-22 óráig. Könnyen megközelíthető a belvárosból.',
            keywords: [
                'próbaterem elérhetőség',
                'próbaterem budapest cím',
                'próbaterem térkép',
                'artist factory kapcsolat',
                'próbaterem budapest 13. kerület',
            ],
        },
        booking: {
            title: 'Online Foglalás - Próbaterem Bérlés | Artist Factory Budapest',
            description:
                'Foglalj próbatermet online most! Válassz 5 hangszigetelt terem közül, válaszd ki az időpontot és foglalj azonnal. Egyszerű online foglalási rendszer.',
            keywords: [
                'próbaterem foglalás',
                'online próbaterem foglalás',
                'próbaterem időpont',
                'próbaterem bérlés online',
                'zenekari próba foglalás',
            ],
        },
        rooms: {
            title: 'Próbatermeink - 5 Hangszigetelt Terem | Artist Factory Budapest',
            description:
                '5 hangszigetelt, légkondicionált próbaterem 4-10 fős zenekaroknak. Prémium felszerelés: Orange, ENGL, Fender, Warwick erősítők, Yamaha dob. Foglalj most!',
            keywords: [
                'próbatermek budapest',
                'hangszigetelt próbaterem',
                'zenekari terem budapest',
                'próbaterem felszerelés',
                'klimatizált próbaterem',
            ],
        },
        studio: {
            title: 'Hangstúdió - Felvétel, Keverés, Maszterelés | Artist Factory Budapest',
            description:
                'Professzionális hangstúdió Budapest belvárosában. Felvétel, keverés, maszterelés tapasztalt hangmérnökkel. Prémium eszközök, kiváló hangzás. Foglalj stúdiót!',
            keywords: [
                'hangstúdió budapest',
                'stúdió felvétel',
                'zenei felvétel',
                'keverés maszterelés',
                'album felvétel',
                'demo felvétel',
            ],
        },
    },
    en: {
        home: {
            title: 'Artist Factory - Rehearsal Rooms Budapest | Soundproof Studios',
            description:
                'Rehearsal rooms in downtown Budapest! 5 soundproof, air-conditioned rehearsal rooms and professional studio since 2007. Premium equipment, online booking available.',
            keywords: [
                'band rehearsal room',
                'rehearsal room rental',
                'music studio budapest',
                'soundproof room budapest',
                'recording studio',
            ],
        },
        prices: {
            title: 'Prices - Rehearsal Room Rental | Artist Factory Budapest',
            description:
                'Rehearsal room prices in downtown Budapest from 5500 HUF/hour. Band rehearsals, individual practice, last-minute deals. Air-conditioned rooms with premium equipment.',
            keywords: [
                'rehearsal room prices',
                'rehearsal rental rates',
                'band practice prices',
                'studio prices budapest',
            ],
        },
        contact: {
            title: 'Contact - Location & Map | Artist Factory Budapest',
            description:
                'Artist Factory rehearsal room location: Pozsonyi út 13, Budapest 1137. Phone: +36-30-655-8488. Open 9 AM - 10 PM. Easily accessible from downtown.',
            keywords: ['rehearsal room location', 'budapest rehearsal space contact', 'music studio address'],
        },
        booking: {
            title: 'Online Booking - Rehearsal Room Rental | Artist Factory Budapest',
            description:
                'Book your rehearsal room online now! Choose from 5 soundproof rooms, select your time slot and book instantly. Simple online booking system.',
            keywords: [
                'rehearsal room booking',
                'online rehearsal booking',
                'book practice room',
                'band rehearsal reservation',
            ],
        },
        rooms: {
            title: 'Our Rehearsal Rooms - 5 Soundproof Rooms | Artist Factory Budapest',
            description:
                '5 soundproof, air-conditioned rehearsal rooms for 4-10 person bands. Premium equipment: Orange, ENGL, Fender, Warwick amps, Yamaha drums. Book now!',
            keywords: [
                'rehearsal rooms budapest',
                'soundproof practice room',
                'band room budapest',
                'rehearsal room equipment',
            ],
        },
        studio: {
            title: 'Recording Studio - Recording, Mixing, Mastering | Artist Factory Budapest',
            description:
                'Professional recording studio in downtown Budapest. Recording, mixing, mastering with experienced sound engineer. Premium equipment, excellent sound quality.',
            keywords: [
                'recording studio budapest',
                'music recording',
                'mixing mastering',
                'album recording',
                'demo recording',
            ],
        },
    },
}
