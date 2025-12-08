import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/verify-booking',
                    '/login',
                    '/register',
                    '/reset-password',
                    '/forgot-password',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/verify-booking',
                    '/login',
                    '/register',
                    '/reset-password',
                    '/forgot-password',
                ],
            },
        ],
        sitemap: 'https://www.artistfactory.hu/sitemap.xml',
        host: 'https://www.artistfactory.hu',
    }
}
