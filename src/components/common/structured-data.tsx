export function LocalBusinessStructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'MusicVenue',
        '@id': 'https://www.artistfactory.hu/#organization',
        name: 'Artist Factory',
        alternateName: 'Artist Factory Próbaterem',
        description:
            'Próbaterem és stúdió Budapest belvárosában. 5 hangszigetelt, légkondicionált próbaterem és professzionális hangstúdió 2007 óta.',
        url: 'https://www.artistfactory.hu',
        telephone: '+36-30-655-8488',
        email: 'info@artistfactory.hu',
        priceRange: '5500 Ft - 10000 Ft',
        image: [
            'https://www.artistfactory.hu/pictures/hero.jpg',
            'https://www.artistfactory.hu/pictures/studio.jpg',
            'https://www.artistfactory.hu/rooms/room1/Room1.jpg',
        ],
        logo: {
            '@type': 'ImageObject',
            url: 'https://www.artistfactory.hu/decorations/AF01_outlined.png',
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Pozsonyi út 13',
            addressLocality: 'Budapest',
            postalCode: '1137',
            addressCountry: 'HU',
            addressRegion: 'Budapest',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 47.5183,
            longitude: 19.0523,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '09:00',
            closes: '22:00',
        },
        sameAs: [
            'https://www.facebook.com/artistfactory',
            'https://www.instagram.com/artistfactory',
        ],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Próbaterem és Stúdió szolgáltatások',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Próbaterem bérlés',
                        description: '5 hangszigetelt, légkondicionált próbaterem prémium felszerelésekkel',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Stúdió felvétel',
                        description:
                            'Professzionális hangfelvétel, keverés és maszterelés szolgáltatások',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Zenekari próba',
                        description: 'Zenekari próbaterem bérlés 4-10 fős zenekarok részére',
                    },
                },
            ],
        },
        amenityFeature: [
            {
                '@type': 'LocationFeatureSpecification',
                name: 'Légkondicionálás',
                value: true,
            },
            {
                '@type': 'LocationFeatureSpecification',
                name: 'Hangszigetelés',
                value: true,
            },
            {
                '@type': 'LocationFeatureSpecification',
                name: 'Prémium hangszerek',
                value: true,
            },
            {
                '@type': 'LocationFeatureSpecification',
                name: 'Online foglalás',
                value: true,
            },
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '150',
            bestRating: '5',
            worstRating: '1',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}

export function WebSiteStructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.artistfactory.hu/#website',
        url: 'https://www.artistfactory.hu',
        name: 'Artist Factory Budapest',
        description: 'Próbaterem és Stúdió Budapest',
        publisher: {
            '@id': 'https://www.artistfactory.hu/#organization',
        },
        inLanguage: ['hu-HU', 'en-US'],
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.artistfactory.hu/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
