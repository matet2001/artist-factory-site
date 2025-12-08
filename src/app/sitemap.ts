import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.artistfactory.hu'

    const routes = [
        '',
        '/prices',
        '/contact',
        '/booking',
        '/studio',
        '/rooms',
        '/privacy-policy',
        '/terms-of-booking',
        '/rooms/room1',
        '/rooms/room2',
        '/rooms/room3',
        '/rooms/room4',
        '/rooms/room5',
    ]

    const locales = ['hu', 'en']

    const sitemap: MetadataRoute.Sitemap = []

    // Generate entries for each route and locale
    locales.forEach((locale) => {
        routes.forEach((route) => {
            sitemap.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: route === '' || route === '/booking' ? 'daily' : 'weekly',
                priority: route === '' ? 1 : route === '/booking' ? 0.9 : 0.8,
                alternates: {
                    languages: {
                        hu: `${baseUrl}/hu${route}`,
                        en: `${baseUrl}/en${route}`,
                    },
                },
            })
        })
    })

    return sitemap
}
