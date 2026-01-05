import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    compress: true,
    poweredByHeader: false,

    async redirects() {
        return [
            // Redirect old Hungarian URLs without locale prefix to /hu
            {
                source: '/kapcsolat',
                destination: '/hu/contact',
                permanent: true,
            },
            {
                source: '/araink',
                destination: '/hu/prices',
                permanent: true,
            },
            {
                source: '/probatermek',
                destination: '/hu/rooms',
                permanent: true,
            },
            {
                source: '/hirek',
                destination: '/hu',
                permanent: true,
            },
            // Redirect old invalid/malformed URLs
            {
                source: '/http---artistfactory-foglalasom-hu-',
                destination: '/hu/booking',
                permanent: true,
            },
            {
                source: '/0630-536-7500',
                destination: '/hu/contact',
                permanent: true,
            },
            // Redirect old PHP pages
            {
                source: '/index.php',
                destination: '/hu',
                permanent: true,
            },
            // Redirect root paths without locale to Hungarian
            {
                source: '/contact',
                destination: '/hu/contact',
                permanent: true,
            },
            {
                source: '/prices',
                destination: '/hu/prices',
                permanent: true,
            },
            {
                source: '/rooms',
                destination: '/hu/rooms',
                permanent: true,
            },
            {
                source: '/studio',
                destination: '/hu/studio',
                permanent: true,
            },
            {
                source: '/booking',
                destination: '/hu/booking',
                permanent: true,
            },
            {
                source: '/rooms/:slug',
                destination: '/hu/rooms/:slug',
                permanent: true,
            },
            // Redirect HTTP to HTTPS (if not handled by Vercel)
            {
                source: '/:path*',
                has: [
                    {
                        type: 'header',
                        key: 'x-forwarded-proto',
                        value: 'http',
                    },
                ],
                destination: 'https://www.artistfactory.hu/:path*',
                permanent: true,
            },
        ];
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);